/**
 * D3 Venn Diagram Layout — TypeScript + D3 v7
 * Converted/ported from d3-venn.js to TypeScript with D3 v7 compatibility.
 *
 * SPDX-License-Identifier: BSD-3-Clause AND MIT
 *
 * Original project: d3-venn
 * Original Author: Christophe Geiser (christophe-g) — Copyright (c) 2015
 * Source: https://github.com/christophe-g/d3-venn
 *
 * Includes/derived from Venn layout code by Ben Frederickson — Copyright (c) 2013
 * (MIT License)
 *
 * Modifications in this port:
 * - TypeScript typings and refactors
 * - Updated for D3 v7 API
 *
 * See LICENSE and THIRD_PARTY_NOTICES for full license texts.
 */

import * as d3 from 'd3';

// ============================================================================
// Type Definitions
// ============================================================================

export interface Circle {
  x: number;
  y: number;
  radius: number;
  setid?: string;
  size?: number;
  previous?: Circle;
}

export interface Point {
  x: number;
  y: number;
}

export interface PointWithParent extends Point {
  parentIndex: number[];
  angle?: number;
}

export interface Area {
  sets: string[];
  size: number;
  weight?: number;
}

export interface VennSet extends Area {
  __key__: string;
  nodes?: any[];
  center?: Point & { disjoint?: boolean };
  innerRadius?: number;
  d?: (t: number) => string;
}

export interface Arc {
  circle: Circle;
  p1: Point;
  p2: Point;
  width: number;
}

export interface IntersectionStats {
  area?: number;
  arcArea?: number;
  polygonArea?: number;
  arcs?: Arc[];
  innerPoints?: PointWithParent[];
  intersectionPoints?: PointWithParent[];
}

export interface VennLayoutParameters {
  maxIterations?: number;
  lossFunction?: (circles: Record<string, Circle>, areas: Area[]) => number;
  initialLayout?: (areas: Area[], params?: any) => Record<string, Circle>;
  fmin?: (
    f: (x: number[]) => number,
    x0: number[],
    params?: any,
  ) => { f: number; solution: number[] };
  restarts?: number;
  history?: any[];
}

export interface OptimizationParams {
  maxIterations?: number;
  nonZeroDelta?: number;
  zeroDelta?: number;
  minErrorDelta?: number;
  rho?: number;
  chi?: number;
  psi?: number;
  sigma?: number;
  callback?: (simplex: any[]) => void;
  tolerance?: number;
  history?: any[];
}

const SMALL = 1e-10;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a getter/setter function for a reusable component
 */
function getSet<T>(option: string, component: T): (value?: any) => any {
  return function (this: any, value?: any) {
    if (!arguments.length) {
      return this[option];
    }
    this[option] = value;
    return component;
  };
}

/**
 * Applies options to a component by calling setter methods
 */
function applier<T extends Record<string, any>>(
  component: T,
  options: Record<string, any>,
): T {
  for (const key in options) {
    if (component[key] && typeof component[key] === 'function') {
      component[key](options[key]);
    }
  }
  return component;
}

/**
 * Binds getter/setter methods to a component for given options
 */
function binder<T extends Record<string, any>>(
  component: T,
  options: Record<string, any>,
): void {
  for (const key in options) {
    if (!component[key]) {
      (component as any)[key] = getSet(key, component).bind(options);
    }
  }
}

// ============================================================================
// Vector Operations
// ============================================================================

/**
 * Creates a zero-filled array
 */
function zeros(x: number): number[] {
  return new Array(x).fill(0);
}

/**
 * Creates a 2D zero-filled matrix
 */
function zerosM(x: number, y: number): number[][] {
  return Array.from({ length: x }, () => zeros(y));
}

/**
 * Computes dot product of two vectors
 */
function dot(a: number[], b: number[]): number {
  let ret = 0;
  for (let i = 0; i < a.length; ++i) {
    ret += a[i] * b[i];
  }
  return ret;
}

/**
 * Computes L2 norm of a vector
 */
function norm2(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

/**
 * Multiplies a vector by a scalar in place
 */
function multiplyBy(a: number[], c: number): void {
  for (let i = 0; i < a.length; ++i) {
    a[i] *= c;
  }
}

/**
 * Computes weighted sum: ret = w1*v1 + w2*v2
 */
function weightedSum(
  ret: number[],
  w1: number,
  v1: number[],
  w2: number,
  v2: number[],
): void {
  for (let j = 0; j < ret.length; ++j) {
    ret[j] = w1 * v1[j] + w2 * v2[j];
  }
}

// ============================================================================
// Geometry Functions
// ============================================================================

/**
 * Computes euclidean distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y),
  );
}

/**
 * Returns the center of a set of points
 */
function getCenter(points: Point[]): Point {
  const center = { x: 0, y: 0 };
  for (let i = 0; i < points.length; ++i) {
    center.x += points[i].x;
    center.y += points[i].y;
  }
  center.x /= points.length;
  center.y /= points.length;
  return center;
}

/**
 * Circle integral helper function
 */
function circleIntegral(r: number, x: number): number {
  const y = Math.sqrt(r * r - x * x);
  return x * y + r * r * Math.atan2(x, y);
}

/**
 * Returns the area of a circle of radius r up to width
 */
function circleArea(r: number, width: number): number {
  return circleIntegral(r, width - r) - circleIntegral(r, -r);
}

/**
 * Returns the overlap area of two circles
 */
export function circleOverlap(r1: number, r2: number, d: number): number {
  // no overlap
  if (d >= r1 + r2) {
    return 0;
  }

  // completely overlapped
  if (d <= Math.abs(r1 - r2)) {
    return Math.PI * Math.min(r1, r2) * Math.min(r1, r2);
  }

  const w1 = r1 - (d * d - r2 * r2 + r1 * r1) / (2 * d);
  const w2 = r2 - (d * d - r1 * r1 + r2 * r2) / (2 * d);
  return circleArea(r1, w1) + circleArea(r2, w2);
}

/**
 * Returns intersection points of two circles
 */
export function circleCircleIntersection(p1: Circle, p2: Circle): Point[] {
  const d = distance(p1, p2);
  const r1 = p1.radius;
  const r2 = p2.radius;

  // too far away or self-contained
  if (d >= r1 + r2 || d <= Math.abs(r1 - r2)) {
    return [];
  }

  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const x0 = p1.x + (a * (p2.x - p1.x)) / d;
  const y0 = p1.y + (a * (p2.y - p1.y)) / d;
  const rx = (-(p2.y - p1.y) * h) / d;
  const ry = (-(p2.x - p1.x) * h) / d;

  return [
    { x: x0 + rx, y: y0 - ry },
    { x: x0 - rx, y: y0 + ry },
  ];
}

// ============================================================================
// Intersection Area Functions
// ============================================================================

/**
 * Gets all intersection points between circles
 */
function getIntersectionPoints(circles: Circle[]): PointWithParent[] {
  const ret: PointWithParent[] = [];
  for (let i = 0; i < circles.length; ++i) {
    for (let j = i + 1; j < circles.length; ++j) {
      const intersect = circleCircleIntersection(circles[i], circles[j]);
      for (let k = 0; k < intersect.length; ++k) {
        const p = intersect[k] as PointWithParent;
        p.parentIndex = [i, j];
        ret.push(p);
      }
    }
  }
  return ret;
}

/**
 * Returns whether a point is contained by all circles
 */
export function containedInCircles(point: Point, circles: Circle[]): boolean {
  for (let i = 0; i < circles.length; ++i) {
    if (distance(point, circles[i]) > circles[i].radius + SMALL) {
      return false;
    }
  }
  return true;
}

/**
 * Returns true when the point is out of all circles
 */
function outOfCircles(point: Point, circles: Circle[]): boolean {
  for (let i = 0; i < circles.length; ++i) {
    if (distance(point, circles[i]) < circles[i].radius + SMALL) {
      return false;
    }
  }
  return true;
}

/**
 * Returns the intersection area of a set of circles
 */
export function intersectionArea(
  circles: Circle[],
  stats?: IntersectionStats,
): number {
  const intersectionPoints = getIntersectionPoints(circles);

  const innerPoints = intersectionPoints.filter((p) =>
    containedInCircles(p, circles),
  );

  let arcArea = 0;
  let polygonArea = 0;
  const arcs: Arc[] = [];

  if (innerPoints.length > 1) {
    const center = getCenter(innerPoints);
    for (let i = 0; i < innerPoints.length; ++i) {
      const p = innerPoints[i];
      p.angle = Math.atan2(p.x - center.x, p.y - center.y);
    }
    innerPoints.sort((a, b) => b.angle! - a.angle!);

    let p2 = innerPoints[innerPoints.length - 1];
    for (let i = 0; i < innerPoints.length; ++i) {
      const p1 = innerPoints[i];

      polygonArea += (p2.x + p1.x) * (p1.y - p2.y);

      const midPoint = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
      let arc: Arc | null = null;

      for (let j = 0; j < p1.parentIndex.length; ++j) {
        if (p2.parentIndex.indexOf(p1.parentIndex[j]) > -1) {
          const circle = circles[p1.parentIndex[j]];
          const a1 = Math.atan2(p1.x - circle.x, p1.y - circle.y);
          const a2 = Math.atan2(p2.x - circle.x, p2.y - circle.y);

          let angleDiff = a2 - a1;
          if (angleDiff < 0) {
            angleDiff += 2 * Math.PI;
          }

          const a = a2 - angleDiff / 2;
          const width = distance(midPoint, {
            x: circle.x + circle.radius * Math.sin(a),
            y: circle.y + circle.radius * Math.cos(a),
          });

          if (arc === null || arc.width > width) {
            arc = {
              circle: circle,
              p1: p1,
              p2: p2,
              width: width,
            };
          }
        }
      }
      if (arc) {
        arcs.push(arc);
        arcArea += circleArea(arc.circle.radius, arc.width);
      }
      p2 = p1;
    }
  } else {
    let smallest = circles[0];
    for (let i = 1; i < circles.length; ++i) {
      if (circles[i].radius < smallest.radius) {
        smallest = circles[i];
      }
    }

    let disjoint = false;
    for (let i = 0; i < circles.length; ++i) {
      if (
        distance(circles[i], smallest) >
        Math.abs(smallest.radius - circles[i].radius)
      ) {
        disjoint = true;
        break;
      }
    }

    if (disjoint) {
      arcArea = polygonArea = 0;
    } else {
      arcArea = smallest.radius * smallest.radius * Math.PI;
      arcs.push({
        circle: smallest,
        p1: { x: smallest.x, y: smallest.y + smallest.radius },
        p2: { x: smallest.x - SMALL, y: smallest.y + smallest.radius },
        width: smallest.radius * 2,
      });
    }
  }

  polygonArea /= 2;
  if (stats) {
    stats.area = arcArea + polygonArea;
    stats.arcArea = arcArea;
    stats.polygonArea = polygonArea;
    stats.arcs = arcs;
    stats.innerPoints = innerPoints;
    stats.intersectionPoints = intersectionPoints;
  }

  return arcArea + polygonArea;
}

// ============================================================================
// Optimization Functions
// ============================================================================

/**
 * Finds the zeros of a function using bisection method
 */
function bisect(
  f: (x: number) => number,
  a: number,
  b: number,
  parameters?: OptimizationParams,
): number {
  parameters = parameters || {};
  const maxIterations = parameters.maxIterations || 100;
  const tolerance = parameters.tolerance || 1e-10;
  const fA = f(a);
  const fB = f(b);
  let delta = b - a;

  if (fA * fB > 0) {
    throw new Error('Initial bisect points must have opposite signs');
  }

  if (fA === 0) return a;
  if (fB === 0) return b;

  for (let i = 0; i < maxIterations; ++i) {
    delta /= 2;
    const mid = a + delta;
    const fMid = f(mid);

    if (fMid * fA >= 0) {
      a = mid;
    }

    if (Math.abs(delta) < tolerance || fMid === 0) {
      return mid;
    }
  }
  return a + delta;
}

/**
 * Minimizes a function using the downhill simplex method
 */
function fmin(
  f: (x: number[]) => number,
  x0: number[],
  parameters?: OptimizationParams,
): { f: number; solution: number[] } {
  parameters = parameters || {};

  const maxIterations = parameters.maxIterations || x0.length * 200;
  const nonZeroDelta = parameters.nonZeroDelta || 1.1;
  const zeroDelta = parameters.zeroDelta || 0.001;
  const minErrorDelta = parameters.minErrorDelta || 1e-6;
  const rho = parameters.rho || 1;
  const chi = parameters.chi || 2;
  const psi = parameters.psi || -0.5;
  const sigma = parameters.sigma || 0.5;
  const callback = parameters.callback;

  const N = x0.length;
  const simplex: (number[] & { fx?: number })[] = new Array(N + 1);
  simplex[0] = x0;
  simplex[0].fx = f(x0);

  for (let i = 0; i < N; ++i) {
    const point = x0.slice();
    point[i] = point[i] ? point[i] * nonZeroDelta : zeroDelta;
    simplex[i + 1] = point;
    simplex[i + 1].fx = f(point);
  }

  const sortOrder = (
    a: number[] & { fx?: number },
    b: number[] & { fx?: number },
  ) => a.fx! - b.fx!;

  const centroid = x0.slice();
  const reflected = x0.slice();
  const contracted = x0.slice();
  const expanded = x0.slice();

  for (let iteration = 0; iteration < maxIterations; ++iteration) {
    simplex.sort(sortOrder);
    if (callback) {
      callback(simplex);
    }

    if (Math.abs(simplex[0].fx! - simplex[N].fx!) < minErrorDelta) {
      break;
    }

    for (let i = 0; i < N; ++i) {
      centroid[i] = 0;
      for (let j = 0; j < N; ++j) {
        centroid[i] += simplex[j][i];
      }
      centroid[i] /= N;
    }

    const worst = simplex[N];
    weightedSum(reflected, 1 + rho, centroid, -rho, worst);
    (reflected as any).fx = f(reflected);

    if ((reflected as any).fx <= simplex[0].fx!) {
      weightedSum(expanded, 1 + chi, centroid, -chi, worst);
      (expanded as any).fx = f(expanded);
      if ((expanded as any).fx < (reflected as any).fx) {
        simplex[N] = expanded as any;
      } else {
        simplex[N] = reflected as any;
      }
    } else if ((reflected as any).fx >= simplex[N - 1].fx!) {
      let shouldReduce = false;

      if ((reflected as any).fx <= worst.fx!) {
        weightedSum(contracted, 1 + psi, centroid, -psi, worst);
        (contracted as any).fx = f(contracted);
        if ((contracted as any).fx < worst.fx!) {
          simplex[N] = contracted as any;
        } else {
          shouldReduce = true;
        }
      } else {
        weightedSum(contracted, 1 - psi * rho, centroid, psi * rho, worst);
        (contracted as any).fx = f(contracted);
        if ((contracted as any).fx <= (reflected as any).fx) {
          simplex[N] = contracted as any;
        } else {
          shouldReduce = true;
        }
      }

      if (shouldReduce) {
        for (let i = 1; i < simplex.length; ++i) {
          weightedSum(simplex[i], 1 - sigma, simplex[0], sigma - 1, simplex[i]);
          simplex[i].fx = f(simplex[i]);
        }
      }
    } else {
      simplex[N] = reflected as any;
    }
  }

  simplex.sort(sortOrder);
  return {
    f: simplex[0].fx!,
    solution: simplex[0],
  };
}

const c1 = 1e-6;
const c2 = 0.1;

/**
 * Wolfe line search for conjugate gradient
 */
function wolfeLineSearch(
  f: (x: number[], fxprime: number[]) => number,
  pk: number[],
  current: { x: number[]; fx: number; fxprime: number[] },
  next: { x: number[]; fx: number; fxprime: number[] },
  a: number,
): number {
  const phi0 = current.fx;
  const phiPrime0 = dot(current.fxprime, pk);
  let phi = phi0;
  let phi_old = phi0;
  let phiPrime = phiPrime0;
  let a0 = 0;

  a = a || 1;

  function zoom(a_lo: number, a_high: number, phi_lo: number): number {
    for (let iteration = 0; iteration < 16; ++iteration) {
      a = (a_lo + a_high) / 2;
      weightedSum(next.x, 1.0, current.x, a, pk);
      phi = next.fx = f(next.x, next.fxprime);
      phiPrime = dot(next.fxprime, pk);

      if (phi > phi0 + c1 * a * phiPrime0 || phi >= phi_lo) {
        a_high = a;
      } else {
        if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
          return a;
        }

        if (phiPrime * (a_high - a_lo) >= 0) {
          a_high = a_lo;
        }

        a_lo = a;
        phi_lo = phi;
      }
    }

    return 0;
  }

  for (let iteration = 0; iteration < 10; ++iteration) {
    weightedSum(next.x, 1.0, current.x, a, pk);
    phi = next.fx = f(next.x, next.fxprime);
    phiPrime = dot(next.fxprime, pk);

    if (phi > phi0 + c1 * a * phiPrime0 || (iteration && phi >= phi_old)) {
      return zoom(a0, a, phi_old);
    }

    if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
      return a;
    }

    if (phiPrime >= 0) {
      return zoom(a, a0, phi);
    }

    phi_old = phi;
    a0 = a;
    a *= 2;
  }

  return 0;
}

/**
 * Minimizes a function using conjugate gradient method
 */
function minimizeConjugateGradient(
  f: (x: number[], fxprime: number[]) => number,
  initial: number[],
  params?: OptimizationParams,
): { x: number[]; fx: number; fxprime: number[] } {
  const current = {
    x: initial.slice(),
    fx: 0,
    fxprime: initial.slice(),
  };
  const next = {
    x: initial.slice(),
    fx: 0,
    fxprime: initial.slice(),
  };
  const yk = initial.slice();
  let pk: number[];
  let a = 1;

  params = params || {};
  const maxIterations = params.maxIterations || initial.length * 5;

  current.fx = f(current.x, current.fxprime);
  pk = current.fxprime.slice();
  multiplyBy(pk, -1);

  for (let i = 0; i < maxIterations; ++i) {
    if (params.history) {
      params.history.push({
        x: current.x.slice(),
        fx: current.fx,
        fxprime: current.fxprime.slice(),
      });
    }

    a = wolfeLineSearch(f, pk, current, next, a);
    if (!a) {
      for (let j = 0; j < pk.length; ++j) {
        pk[j] = -1 * current.fxprime[j];
      }
    } else {
      weightedSum(yk, 1, next.fxprime, -1, current.fxprime);

      const delta_k = dot(current.fxprime, current.fxprime);
      const beta_k = Math.max(0, dot(yk, next.fxprime) / delta_k);

      weightedSum(pk, beta_k, pk, -1, next.fxprime);

      // Swap current and next
      const tempX = current.x;
      const tempFx = current.fx;
      const tempFxprime = current.fxprime;
      current.x = next.x;
      current.fx = next.fx;
      current.fxprime = next.fxprime;
      next.x = tempX;
      next.fx = tempFx;
      next.fxprime = tempFxprime;
    }

    if (norm2(current.fxprime) <= 1e-5) {
      break;
    }
  }

  if (params.history) {
    params.history.push({
      x: current.x.slice(),
      fx: current.fx,
      fxprime: current.fxprime.slice(),
    });
  }

  return current;
}

// ============================================================================
// Layout Helper Functions
// ============================================================================

/**
 * Returns the distance necessary for two circles to have the given overlap area
 */
function distanceFromIntersectArea(
  r1: number,
  r2: number,
  overlap: number,
): number {
  if (Math.min(r1, r2) * Math.min(r1, r2) * Math.PI <= overlap + SMALL) {
    return Math.abs(r1 - r2);
  }

  return bisect(
    (distance) => circleOverlap(r1, r2, distance) - overlap,
    0,
    r1 + r2,
  );
}

/**
 * Adds missing pairwise intersection areas (treating them as disjoint)
 */
function addMissingAreas(areas: Area[]): Area[] {
  areas = areas.slice();

  const ids: string[] = [];
  const pairs: Record<string, boolean> = {};

  for (let i = 0; i < areas.length; ++i) {
    const area = areas[i];
    if (area.sets.length === 1) {
      ids.push(area.sets[0]);
    } else if (area.sets.length === 2) {
      const a = area.sets[0];
      const b = area.sets[1];
      pairs[[a, b].toString()] = true;
      pairs[[b, a].toString()] = true;
    }
  }

  ids.sort((a, b) => (a > b ? 1 : -1));

  for (let i = 0; i < ids.length; ++i) {
    const a = ids[i];
    for (let j = i + 1; j < ids.length; ++j) {
      const b = ids[j];
      if (!pairs[[a, b].toString()]) {
        areas.push({
          sets: [a, b],
          size: 0,
        });
      }
    }
  }
  return areas;
}

/**
 * Returns distance matrices between sets
 */
function getDistanceMatrices(
  areas: Area[],
  sets: Area[],
  setids: Record<string, number>,
): { distances: number[][]; constraints: number[][] } {
  const distances = zerosM(sets.length, sets.length);
  const constraints = zerosM(sets.length, sets.length);

  areas
    .filter((x) => x.sets.length === 2)
    .forEach((current) => {
      const left = setids[current.sets[0]];
      const right = setids[current.sets[1]];
      const r1 = Math.sqrt(sets[left].size / Math.PI);
      const r2 = Math.sqrt(sets[right].size / Math.PI);
      const dist = distanceFromIntersectArea(r1, r2, current.size);

      distances[left][right] = distances[right][left] = dist;

      let c = 0;
      if (current.size + 1e-10 >= Math.min(sets[left].size, sets[right].size)) {
        c = 1;
      } else if (current.size <= 1e-10) {
        c = -1;
      }
      constraints[left][right] = constraints[right][left] = c;
    });

  return { distances, constraints };
}

/**
 * Computes gradient and loss for constrained MDS optimizer
 */
function constrainedMDSGradient(
  x: number[],
  fxprime: number[],
  distances: number[][],
  constraints: number[][],
): number {
  let loss = 0;

  for (let i = 0; i < fxprime.length; ++i) {
    fxprime[i] = 0;
  }

  for (let i = 0; i < distances.length; ++i) {
    const xi = x[2 * i];
    const yi = x[2 * i + 1];
    for (let j = i + 1; j < distances.length; ++j) {
      const xj = x[2 * j];
      const yj = x[2 * j + 1];
      const dij = distances[i][j];
      const constraint = constraints[i][j];

      const squaredDistance = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi);
      const dist = Math.sqrt(squaredDistance);
      const delta = squaredDistance - dij * dij;

      if ((constraint > 0 && dist <= dij) || (constraint < 0 && dist >= dij)) {
        continue;
      }

      loss += 2 * delta * delta;

      fxprime[2 * i] += 4 * delta * (xi - xj);
      fxprime[2 * i + 1] += 4 * delta * (yi - yj);

      fxprime[2 * j] += 4 * delta * (xj - xi);
      fxprime[2 * j + 1] += 4 * delta * (yj - yi);
    }
  }
  return loss;
}

/**
 * Uses constrained MDS to generate an initial layout
 */
function constrainedMDSLayout(
  areas: Area[],
  params?: VennLayoutParameters,
): Record<string, Circle> {
  params = params || {};
  const restarts = params.restarts || 10;

  const sets: Area[] = [];
  const setids: Record<string, number> = {};

  for (let i = 0; i < areas.length; ++i) {
    const area = areas[i];
    if (area.sets.length === 1) {
      setids[area.sets[0]] = sets.length;
      sets.push(area);
    }
  }

  const matrices = getDistanceMatrices(areas, sets, setids);
  let distances = matrices.distances;
  const constraints = matrices.constraints;

  const norm = norm2(distances.map(norm2)) / distances.length;
  distances = distances.map((row) => row.map((value) => value / norm));

  const obj = (x: number[], fxprime: number[]) =>
    constrainedMDSGradient(x, fxprime, distances, constraints);

  let best: { x: number[]; fx: number; fxprime: number[] } | undefined;
  let current: { x: number[]; fx: number; fxprime: number[] };

  for (let i = 0; i < restarts; ++i) {
    const initial = zeros(distances.length * 2).map(Math.random);
    current = minimizeConjugateGradient(obj, initial, params);
    if (!best || current.fx < best.fx) {
      best = current;
    }
  }

  const positions = best!.x;

  const circles: Record<string, Circle> = {};
  for (let i = 0; i < sets.length; ++i) {
    const set = sets[i];
    circles[set.sets[0]] = {
      x: positions[2 * i] * norm,
      y: positions[2 * i + 1] * norm,
      radius: Math.sqrt(set.size / Math.PI),
    };
  }

  if (params.history) {
    for (let i = 0; i < params.history.length; ++i) {
      multiplyBy(params.history[i].x, norm);
    }
  }

  return circles;
}

/**
 * Loss function for venn layout
 */
function lossFunction(sets: Record<string, Circle>, overlaps: Area[]): number {
  let output = 0;

  function getCircles(indices: string[]): Circle[] {
    return indices.map((i) => sets[i]);
  }

  for (let i = 0; i < overlaps.length; ++i) {
    const area = overlaps[i];
    let overlap: number;

    if (area.sets.length === 1) {
      continue;
    } else if (area.sets.length === 2) {
      const left = sets[area.sets[0]];
      const right = sets[area.sets[1]];
      overlap = circleOverlap(left.radius, right.radius, distance(left, right));
    } else {
      overlap = intersectionArea(getCircles(area.sets));
    }

    const weight = area.hasOwnProperty('weight') ? area.weight! : 1.0;
    output += weight * (overlap - area.size) * (overlap - area.size);
  }

  return output;
}

/**
 * Greedy layout algorithm
 */
function greedyLayout(areas: Area[]): Record<string, Circle> {
  const circles: Record<string, Circle> = {};
  const setOverlaps: Record<
    string,
    Array<{ set: string; size: number; weight: number }>
  > = {};

  for (let i = 0; i < areas.length; ++i) {
    const area = areas[i];
    if (area.sets.length === 1) {
      const set = area.sets[0];
      circles[set] = {
        x: 1e10,
        y: 1e10,
        radius: Math.sqrt(area.size / Math.PI),
        size: area.size,
      };
      setOverlaps[set] = [];
    }
  }

  const pairAreas = areas.filter((a) => a.sets.length === 2);

  for (let i = 0; i < pairAreas.length; ++i) {
    const current = pairAreas[i];
    let weight = current.hasOwnProperty('weight') ? current.weight! : 1.0;
    const left = current.sets[0];
    const right = current.sets[1];

    if (
      current.size + SMALL >=
      Math.min(circles[left].size!, circles[right].size!)
    ) {
      weight = 0;
    }

    setOverlaps[left].push({ set: right, size: current.size, weight });
    setOverlaps[right].push({ set: left, size: current.size, weight });
  }

  const mostOverlapped: Array<{ set: string; size: number }> = [];
  for (const set in setOverlaps) {
    if (setOverlaps.hasOwnProperty(set)) {
      let size = 0;
      for (let i = 0; i < setOverlaps[set].length; ++i) {
        size += setOverlaps[set][i].size * setOverlaps[set][i].weight;
      }
      mostOverlapped.push({ set, size });
    }
  }

  const sortOrder = (a: { size: number }, b: { size: number }) =>
    b.size - a.size;
  mostOverlapped.sort(sortOrder);

  const positioned: Record<string, boolean> = {};

  function isPositioned(element: { set: string }): boolean {
    return element.set in positioned;
  }

  function positionSet(point: Point, index: string): void {
    circles[index].x = point.x;
    circles[index].y = point.y;
    positioned[index] = true;
  }

  positionSet({ x: 0, y: 0 }, mostOverlapped[0].set);

  for (let i = 1; i < mostOverlapped.length; ++i) {
    const setIndex = mostOverlapped[i].set;
    const overlap = setOverlaps[setIndex].filter(isPositioned);
    const set = circles[setIndex];
    overlap.sort(sortOrder);

    if (overlap.length === 0) {
      throw new Error('ERROR: missing pairwise overlap information');
    }

    const points: Point[] = [];
    for (let j = 0; j < overlap.length; ++j) {
      const p1 = circles[overlap[j].set];
      const d1 = distanceFromIntersectArea(
        set.radius,
        p1.radius,
        overlap[j].size,
      );

      points.push({ x: p1.x + d1, y: p1.y });
      points.push({ x: p1.x - d1, y: p1.y });
      points.push({ y: p1.y + d1, x: p1.x });
      points.push({ y: p1.y - d1, x: p1.x });

      for (let k = j + 1; k < overlap.length; ++k) {
        const p2 = circles[overlap[k].set];
        const d2 = distanceFromIntersectArea(
          set.radius,
          p2.radius,
          overlap[k].size,
        );

        const extraPoints = circleCircleIntersection(
          { x: p1.x, y: p1.y, radius: d1 },
          { x: p2.x, y: p2.y, radius: d2 },
        );

        for (let l = 0; l < extraPoints.length; ++l) {
          points.push(extraPoints[l]);
        }
      }
    }

    let bestLoss = 1e50;
    let bestPoint = points[0];
    for (let j = 0; j < points.length; ++j) {
      circles[setIndex].x = points[j].x;
      circles[setIndex].y = points[j].y;
      const loss = lossFunction(circles, areas);
      if (loss < bestLoss) {
        bestLoss = loss;
        bestPoint = points[j];
      }
    }

    positionSet(bestPoint, setIndex);
  }

  return circles;
}

/**
 * Takes the best working variant of constrained MDS or greedy
 */
function bestInitialLayout(
  areas: Area[],
  params?: VennLayoutParameters,
): Record<string, Circle> {
  let initial = greedyLayout(areas);

  if (areas.length >= 8) {
    const constrained = constrainedMDSLayout(areas, params);
    const constrainedLoss = lossFunction(constrained, areas);
    const greedyLoss = lossFunction(initial, areas);

    if (constrainedLoss + 1e-8 < greedyLoss) {
      initial = constrained;
    }
  }
  return initial;
}

/**
 * Main venn layout function
 */
export function venn(
  areas: Area[],
  parameters?: VennLayoutParameters,
): Record<string, Circle> {
  parameters = parameters || {};
  parameters.maxIterations = parameters.maxIterations || 500;
  const lossFn = parameters.lossFunction || lossFunction;
  const initialLayout = parameters.initialLayout || bestInitialLayout;
  const fminFn = parameters.fmin || fmin;

  areas = addMissingAreas(areas);

  const circles = initialLayout(areas, parameters);

  const initial: number[] = [];
  const setids: string[] = [];

  for (const setid in circles) {
    if (circles.hasOwnProperty(setid)) {
      initial.push(circles[setid].x);
      initial.push(circles[setid].y);
      setids.push(setid);
    }
  }

  let totalFunctionCalls = 0;
  const solution = fminFn(
    (values: number[]) => {
      totalFunctionCalls += 1;
      const current: Record<string, Circle> = {};
      for (let i = 0; i < setids.length; ++i) {
        const setid = setids[i];
        current[setid] = {
          x: values[2 * i],
          y: values[2 * i + 1],
          radius: circles[setid].radius,
        };
      }
      return lossFn(current, areas);
    },
    initial,
    parameters,
  );

  const positions = solution.solution;
  for (let i = 0; i < setids.length; ++i) {
    const setid = setids[i];
    circles[setid].x = positions[2 * i];
    circles[setid].y = positions[2 * i + 1];
  }

  return circles;
}

// ============================================================================
// Normalization and Scaling Functions
// ============================================================================

/**
 * Finds disjoint clusters of circles
 */
function disjointCluster(circles: Circle[]): Circle[][] {
  circles.forEach((circle) => {
    (circle as any).parent = circle;
  });

  function find(circle: Circle): Circle {
    if ((circle as any).parent !== circle) {
      (circle as any).parent = find((circle as any).parent);
    }
    return (circle as any).parent;
  }

  function union(x: Circle, y: Circle): void {
    const xRoot = find(x);
    const yRoot = find(y);
    (xRoot as any).parent = yRoot;
  }

  for (let i = 0; i < circles.length; ++i) {
    for (let j = i + 1; j < circles.length; ++j) {
      const maxDistance = circles[i].radius + circles[j].radius;
      if (distance(circles[i], circles[j]) + 1e-10 < maxDistance) {
        union(circles[j], circles[i]);
      }
    }
  }

  const disjointClusters: Record<string, Circle[]> = {};
  for (let i = 0; i < circles.length; ++i) {
    const setid = find(circles[i]).setid!;
    if (!disjointClusters[setid]) {
      disjointClusters[setid] = [];
    }
    disjointClusters[setid].push(circles[i]);
  }

  circles.forEach((circle) => {
    delete (circle as any).parent;
  });

  const ret: Circle[][] = [];
  for (const setid in disjointClusters) {
    if (disjointClusters.hasOwnProperty(setid)) {
      ret.push(disjointClusters[setid]);
    }
  }
  return ret;
}

/**
 * Gets bounding box of circles
 */
function getBoundingBox(circles: Circle[]): {
  xRange: { max: number; min: number };
  yRange: { max: number; min: number };
} {
  const minMax = (d: 'x' | 'y') => {
    const hi = Math.max(...circles.map((c) => c[d] + c.radius));
    const lo = Math.min(...circles.map((c) => c[d] - c.radius));
    return { max: hi, min: lo };
  };

  return {
    xRange: minMax('x'),
    yRange: minMax('y'),
  };
}

/**
 * Orientates circles to a specific orientation
 */
function orientateCircles(circles: Circle[], orientation: number): void {
  circles.sort((a, b) => b.radius - a.radius);

  if (circles.length > 0) {
    const largestX = circles[0].x;
    const largestY = circles[0].y;

    for (let i = 0; i < circles.length; ++i) {
      circles[i].x -= largestX;
      circles[i].y -= largestY;
    }
  }

  if (circles.length > 1) {
    const rotation = Math.atan2(circles[1].x, circles[1].y) - orientation;
    const c = Math.cos(rotation);
    const s = Math.sin(rotation);

    for (let i = 0; i < circles.length; ++i) {
      const x = circles[i].x;
      const y = circles[i].y;
      circles[i].x = c * x - s * y;
      circles[i].y = s * x + c * y;
    }
  }

  if (circles.length > 2) {
    let angle = Math.atan2(circles[2].x, circles[2].y) - orientation;
    while (angle < 0) angle += 2 * Math.PI;
    while (angle > 2 * Math.PI) angle -= 2 * Math.PI;

    if (angle > Math.PI) {
      const slope = circles[1].y / (1e-10 + circles[1].x);
      for (let i = 0; i < circles.length; ++i) {
        const d = (circles[i].x + slope * circles[i].y) / (1 + slope * slope);
        circles[i].x = 2 * d - circles[i].x;
        circles[i].y = 2 * d * slope - circles[i].y;
      }
    }
  }
}

/**
 * Normalizes solution and arranges disjoint clusters
 */
export function normalizeSolution(
  solution: Record<string, Circle>,
  orientation: number = Math.PI / 2,
): Record<string, Circle> {
  const circles: Circle[] = [];
  for (const setid in solution) {
    if (solution.hasOwnProperty(setid)) {
      const previous = solution[setid];
      circles.push({
        x: previous.x,
        y: previous.y,
        radius: previous.radius,
        setid: setid,
      });
    }
  }

  const clusters = disjointCluster(circles);

  for (let i = 0; i < clusters.length; ++i) {
    orientateCircles(clusters[i], orientation);
    const bounds = getBoundingBox(clusters[i]);
    (clusters[i] as any).size =
      (bounds.xRange.max - bounds.xRange.min) *
      (bounds.yRange.max - bounds.yRange.min);
    (clusters[i] as any).bounds = bounds;
  }

  clusters.sort((a, b) => (b as any).size - (a as any).size);

  const mainCircles = clusters[0];
  let returnBounds = (mainCircles as any).bounds;
  const spacing = (returnBounds.xRange.max - returnBounds.xRange.min) / 50;

  function addCluster(
    cluster: Circle[] | undefined,
    right: boolean,
    bottom: boolean,
  ): void {
    if (!cluster) return;

    const bounds = (cluster as any).bounds;
    let xOffset: number, yOffset: number, centreing: number;

    if (right) {
      xOffset = returnBounds.xRange.max - bounds.xRange.min + spacing;
    } else {
      xOffset = returnBounds.xRange.max - bounds.xRange.max - spacing;
      centreing =
        (bounds.xRange.max - bounds.xRange.min) / 2 -
        (returnBounds.xRange.max - returnBounds.xRange.min) / 2;
      if (centreing < 0) xOffset += centreing;
    }

    if (bottom) {
      yOffset = returnBounds.yRange.max - bounds.yRange.min + spacing;
    } else {
      yOffset = returnBounds.yRange.max - bounds.yRange.max - spacing;
      centreing =
        (bounds.yRange.max - bounds.yRange.min) / 2 -
        (returnBounds.yRange.max - returnBounds.yRange.min) / 2;
      if (centreing < 0) yOffset += centreing;
    }

    for (let j = 0; j < cluster.length; ++j) {
      cluster[j].x += xOffset;
      cluster[j].y += yOffset;
      mainCircles.push(cluster[j]);
    }
  }

  let index = 1;
  while (index < clusters.length) {
    addCluster(clusters[index], true, false);
    addCluster(clusters[index + 1], false, true);
    addCluster(clusters[index + 2], true, true);
    index += 3;
    returnBounds = getBoundingBox(mainCircles);
  }

  const ret: Record<string, Circle> = {};
  for (let i = 0; i < mainCircles.length; ++i) {
    ret[mainCircles[i].setid!] = mainCircles[i];
  }
  return ret;
}

/**
 * Scales solution to fit in width/height with padding
 */
export function scaleSolution(
  solution: Record<string, Circle>,
  width: number,
  height: number,
  padding: number,
): Record<string, Circle> {
  const circles: Circle[] = [];
  const setids: string[] = [];

  for (const setid in solution) {
    if (solution.hasOwnProperty(setid)) {
      setids.push(setid);
      circles.push(solution[setid]);
    }
  }

  width -= 2 * padding;
  height -= 2 * padding;

  const bounds = getBoundingBox(circles);
  const xRange = bounds.xRange;
  const yRange = bounds.yRange;
  const xScaling = width / (xRange.max - xRange.min);
  const yScaling = height / (yRange.max - yRange.min);
  const scaling = Math.min(yScaling, xScaling);

  const xOffset = (width - (xRange.max - xRange.min) * scaling) / 2;
  const yOffset = (height - (yRange.max - yRange.min) * scaling) / 2;

  const scaled: Record<string, Circle> = {};
  for (let i = 0; i < circles.length; ++i) {
    const circle = circles[i];
    scaled[setids[i]] = {
      radius: scaling * circle.radius,
      x: padding + xOffset + (circle.x - xRange.min) * scaling,
      y: padding + yOffset + (circle.y - yRange.min) * scaling,
    };
  }

  return scaled;
}

// ============================================================================
// Text Center Computation Functions
// ============================================================================

/**
 * Computes margin of a point relative to circles
 */
function circleMargin(
  current: Point,
  interior: Circle[],
  exterior: Circle[],
): number {
  let margin = interior[0].radius - distance(interior[0], current);

  for (let i = 1; i < interior.length; ++i) {
    const m = interior[i].radius - distance(interior[i], current);
    if (m <= margin) {
      margin = m;
    }
  }

  for (let i = 0; i < exterior.length; ++i) {
    const m = distance(exterior[i], current) - exterior[i].radius;
    if (m <= margin) {
      margin = m;
    }
  }
  return margin;
}

/**
 * Computes the center point for text placement
 */
function computeTextCentre(
  interior: Circle[],
  exterior: Circle[],
): Point & { disjoint?: boolean } {
  const points: Point[] = [];

  for (let i = 0; i < interior.length; ++i) {
    const c = interior[i];
    points.push({ x: c.x, y: c.y });
    points.push({ x: c.x + c.radius / 2, y: c.y });
    points.push({ x: c.x - c.radius / 2, y: c.y });
    points.push({ x: c.x, y: c.y + c.radius / 2 });
    points.push({ x: c.x, y: c.y - c.radius / 2 });
  }

  let initial = points[0];
  let margin = circleMargin(points[0], interior, exterior);
  for (let i = 1; i < points.length; ++i) {
    const m = circleMargin(points[i], interior, exterior);
    if (m >= margin) {
      initial = points[i];
      margin = m;
    }
  }

  const solution = fmin(
    (p) => -1 * circleMargin({ x: p[0], y: p[1] }, interior, exterior),
    [initial.x, initial.y],
    { maxIterations: 500, minErrorDelta: 1e-10 },
  ).solution;

  const ret: Point & { disjoint?: boolean } = {
    x: solution[0],
    y: solution[1],
  };

  let valid = true;
  for (let i = 0; i < interior.length; ++i) {
    if (distance(ret, interior[i]) > interior[i].radius) {
      valid = false;
      break;
    }
  }

  for (let i = 0; i < exterior.length; ++i) {
    if (distance(ret, exterior[i]) < exterior[i].radius) {
      valid = false;
      break;
    }
  }

  if (!valid) {
    if (interior.length === 1) {
      ret.x = interior[0].x;
      ret.y = interior[0].y;
    } else {
      const areaStats: IntersectionStats = {};
      intersectionArea(interior, areaStats);

      if (areaStats.arcs!.length === 0) {
        ret.x = 0;
        ret.y = -1000;
        ret.disjoint = true;
      } else if (areaStats.arcs!.length === 1) {
        ret.x = areaStats.arcs![0].circle.x;
        ret.y = areaStats.arcs![0].circle.y;
      } else {
        const points = areaStats.arcs!.map((arc) => arc.p1);
        ret.x = 0;
        ret.y = 0;
        for (let i = 0; i < points.length; ++i) {
          ret.x += points[i].x;
          ret.y += points[i].y;
        }
        ret.x /= points.length;
        ret.y /= points.length;
      }
    }
  }

  return ret;
}

/**
 * Gets overlapping circles dictionary
 */
function getOverlappingCircles(
  circles: Record<string, Circle>,
): Record<string, string[]> {
  const ret: Record<string, string[]> = {};
  const circleids: string[] = [];

  for (const circleid in circles) {
    circleids.push(circleid);
    ret[circleid] = [];
  }

  for (let i = 0; i < circleids.length; i++) {
    const a = circles[circleids[i]];
    for (let j = i + 1; j < circleids.length; ++j) {
      const b = circles[circleids[j]];
      const d = distance(a, b);

      if (d + b.radius <= a.radius + 1e-10) {
        ret[circleids[j]].push(circleids[i]);
      } else if (d + a.radius <= b.radius + 1e-10) {
        ret[circleids[i]].push(circleids[j]);
      }
    }
  }
  return ret;
}

/**
 * Computes text centers for all areas
 */
export function computeTextCentres(
  circles: Record<string, Circle>,
  areas: Area[],
): Record<string, Point & { disjoint?: boolean }> {
  const ret: Record<string, Point & { disjoint?: boolean }> = {};
  const overlapped = getOverlappingCircles(circles);

  for (let i = 0; i < areas.length; ++i) {
    const area = areas[i].sets;
    const areaids: Record<string, boolean> = {};
    const exclude: Record<string, boolean> = {};

    for (let j = 0; j < area.length; ++j) {
      areaids[area[j]] = true;
      const overlaps = overlapped[area[j]];
      for (let k = 0; k < overlaps.length; ++k) {
        exclude[overlaps[k]] = true;
      }
    }

    const interior: Circle[] = [];
    const exterior: Circle[] = [];
    for (const setid in circles) {
      if (setid in areaids) {
        interior.push(circles[setid]);
      } else if (!(setid in exclude)) {
        exterior.push(circles[setid]);
      }
    }

    const centre = computeTextCentre(interior, exterior);
    ret[area.toString()] = centre;
    if (centre.disjoint && areas[i].size > 0) {
      console.log('WARNING: area ' + area + ' not represented on screen');
    }
  }
  return ret;
}

// ============================================================================
// Path Generation Functions
// ============================================================================

/**
 * Generates SVG path for a circle
 */
function circlePath(x: number, y: number, r: number): string {
  const ret: string[] = [];
  ret.push('\nM', x.toString(), y.toString());
  ret.push('\nm', (-r).toString(), '0');
  ret.push(
    '\na',
    r.toString(),
    r.toString(),
    '0',
    '1',
    '0',
    (r * 2).toString(),
    '0',
  );
  ret.push(
    '\na',
    r.toString(),
    r.toString(),
    '0',
    '1',
    '0',
    (-r * 2).toString(),
    '0',
  );
  return ret.join(' ');
}

/**
 * Returns SVG path of intersection area
 */
export function intersectionAreaPath(circles: Circle[]): string {
  const stats: IntersectionStats = {};
  intersectionArea(circles, stats);
  const arcs = stats.arcs!;

  if (arcs.length === 0) {
    return 'M 0 0';
  } else if (arcs.length === 1) {
    const circle = arcs[0].circle;
    return circlePath(circle.x, circle.y, circle.radius);
  } else {
    const ret = ['\nM', arcs[0].p2.x.toString(), arcs[0].p2.y.toString()];
    for (let i = 0; i < arcs.length; ++i) {
      const arc = arcs[i];
      const r = arc.circle.radius;
      const wide = arc.width > r;
      ret.push(
        '\nA',
        r.toString(),
        r.toString(),
        '0',
        wide ? '1' : '0',
        '1',
        arc.p1.x.toString(),
        arc.p1.y.toString(),
      );
    }
    return ret.join(' ');
  }
}

// ============================================================================
// Packing Functions (D3 v7 Compatible)
// ============================================================================

export interface VennLayoutConfig {
  sets: Map<string, VennSet> | null;
  setsAccessor: (d: any) => string[];
  setsSize: (size: number) => number;
  packingStrategy: (layout: any, data?: any) => any;
  packingConfig: Record<string, any>;
  size: [number, number];
  padding: number;
  layoutFunction: (
    areas: Area[],
    params?: VennLayoutParameters,
  ) => Record<string, Circle>;
  orientation: number;
  normalize: boolean;
}

/**
 * Pack function using D3 v7 pack layout
 * Updated to use d3.pack() instead of d3.layout.pack()
 */
export function pack(layout: any): void {
  const packerConfig = layout.packerConfig();

  layout.sets().forEach((set: VennSet) => {
    const innerRadius = set.innerRadius!;
    const center = set.center!;
    const children = set.nodes || [];
    const x = center.x - innerRadius;
    const y = center.y - innerRadius;

    // D3 v7: use d3.pack() instead of d3.layout.pack()
    const packLayout = d3
      .pack<any>()
      .size([innerRadius * 2, innerRadius * 2])
      .padding(packerConfig.padding || 0);

    applier(packLayout as any, packerConfig);

    const root = d3
      .hierarchy({ children: children })
      .sum((d: any) => d.value || 1);

    packLayout(root);

    // Translate nodes to the center
    if (children) {
      root
        .descendants()
        .slice(1)
        .forEach((node: any, i: number) => {
          if (children[i]) {
            children[i].x = node.x + x;
            children[i].y = node.y + y;
            children[i].r = node.r;
          }
        });
    }
  });
}

/**
 * Distribute nodes randomly inside venn sets
 */
export function distribute(layout: any): void {
  const circles = layout.circles();

  layout.sets().forEach((set: VennSet) => {
    const queue: any[] = [];
    const maxAttempt = 500;
    const inCircles: Circle[] = [];
    const outCircles: Circle[] = [];

    for (const k in circles) {
      if (set.sets.indexOf(k) > -1) {
        inCircles.push(circles[k]);
      } else {
        outCircles.push(circles[k]);
      }
    }

    const nodes = set.nodes || [];
    const centre = set.center!;
    const innerRadius = set.innerRadius!;

    nodes.forEach((n: any, i: number) => {
      let attempt = 0;
      let candidate: Point | null = null;

      if (i === 0) {
        n.x = centre.x;
        n.y = centre.y;
        queue.push(n);
      } else {
        while (!candidate && attempt < maxAttempt) {
          const idx = Math.floor(Math.random() * queue.length);
          const s = queue[idx];
          const a = 2 * Math.PI * Math.random();
          const r = Math.sqrt(
            Math.random() * (innerRadius * innerRadius + 100),
          );
          const p = {
            x: s.x + r * Math.cos(a),
            y: s.y + r * Math.sin(a),
          };
          attempt++;
          if (containedInCircles(p, inCircles) && outOfCircles(p, outCircles)) {
            candidate = p;
            queue.push(p);
          }
        }
        if (!candidate) {
          console.warn('NO CANDIDATE');
          candidate = { x: centre.x, y: centre.y };
        }
        n.x = candidate.x;
        n.y = candidate.y;
      }
    });
  });
}

/**
 * Force layout packing using D3 v7 forceSimulation
 * Updated from d3.layout.force() to d3.forceSimulation()
 */
export function force(layout: any, data: any[]): any {
  let forceSimulation = layout.packer();

  if (!forceSimulation) {
    // D3 v7: Create force simulation with proper configuration
    forceSimulation = d3
      .forceSimulation<any>()
      .alphaDecay(0.05)
      .velocityDecay(0.3);

    // Bind configuration properties
    const config = {
      padding: 3,
      maxRadius: 8,
      collider: true,
      ticker: null,
    };

    binder(forceSimulation as any, config);
  }

  const packingConfig = layout.packingConfig();

  const sets = layout.sets();

  const padding = (forceSimulation as any).padding() || 3;
  const maxRadius = (forceSimulation as any).maxRadius() || 8;
  const collider = (forceSimulation as any).collider !== false;

  applier(forceSimulation as any, packingConfig);

  // Set up nodes
  data.forEach((d: any) => {
    const center = sets.get(d.__setKey__).center;
    d.x = d.x ? d.x * 1 : center.x;
    d.y = d.y ? d.y * 1 : center.y;
    d.vx = 0;
    d.vy = 0;
  });

  // D3 v7: Use forceSimulation API
  forceSimulation
    .nodes(data)
    .force(
      'x',
      d3
        .forceX<any>((d: any) => {
          const center = sets.get(d.__setKey__).center;
          return center.x;
        })
        .strength(0.2),
    )
    .force(
      'y',
      d3
        .forceY<any>((d: any) => {
          const center = sets.get(d.__setKey__).center;
          return center.y;
        })
        .strength(0.2),
    );

  // Add collision force if enabled
  if (collider) {
    forceSimulation.force(
      'collide',
      d3
        .forceCollide<any>((d: any) => {
          return (d.r || maxRadius) + padding;
        })
        .strength(0.5),
    );
  }

  // Custom ticker if provided
  const ticker = (forceSimulation as any).ticker?.();
  if (ticker) {
    forceSimulation.on('tick', () => ticker(layout));
  }

  return forceSimulation;
}

// ============================================================================
// Main Venn Layout Factory Function (D3 v7 Compatible)
// ============================================================================

/**
 * Creates a venn diagram layout function (D3 v7 compatible)
 * Uses native Map instead of d3.map
 */
export function vennLayout() {
  const opts: VennLayoutConfig = {
    sets: null,
    setsAccessor: (d: any) => d.set || [],
    setsSize: (size: number) => size,
    packingStrategy: pack,
    packingConfig: {
      value: (d: any) => d.value,
    },
    size: [1, 1],
    padding: 15,
    layoutFunction: venn,
    orientation: Math.PI / 2,
    normalize: true,
  };

  let circles: Record<string, Circle> | undefined;
  let centres: Record<string, Point & { disjoint?: boolean }> | undefined;
  let packer: any;

  // Define layout function first, then bind
  function layout(data?: any[]): any {
    if (!arguments.length) return opts.sets;
    compute(data!);
    return layout;
  }

  binder(layout as any, opts);

  function compute(data: any[]): any[] {
    const sets = extractSets(data);
    const setsValues = Array.from(sets.values());
    const layoutFn = opts.layoutFunction;

    let solution = layoutFn(setsValues);

    console.info('data: ', data);
    console.info('sets: ', sets);

    if (opts.normalize) {
      solution = normalizeSolution(solution, opts.orientation);
    }

    const oldCircles = circles;
    circles = scaleSolution(solution, opts.size[0], opts.size[1], opts.padding);

    // Preserve previous positions for animation
    if (oldCircles) {
      for (const k in oldCircles) {
        if (circles[k]) {
          circles[k].previous = oldCircles[k];
        }
      }
    }

    centres = computeTextCentres(circles, setsValues);

    // Store path and center info in sets
    sets.forEach((set, key) => {
      set.d = pathTween(set);
      set.center = centres![key];
      set.innerRadius = computeDistanceToCircles(set);
    });

    packer = opts.packingStrategy(layout, data);

    function computeDistanceToCircles(set: VennSet): number {
      const setIds = set.sets;
      const center = set.center!;
      let candidate = Infinity;

      for (const k in circles) {
        const circle = circles[k];
        const isInside = setIds.indexOf(k) > -1;
        const isOverlap =
          setIds.indexOf(k) < -1 && checkOverlap(setIds, circle);
        let dist = distance(center, circle);

        dist = isInside
          ? circle.radius - dist
          : isOverlap
            ? dist - circle.radius
            : dist + circle.radius;

        if (dist < candidate) {
          candidate = dist;
        }
      }
      return candidate;
    }

    function checkOverlap(setIds: string[], circle: Circle): boolean {
      for (let i = 0; i < setIds.length; i++) {
        const c = circles![setIds[i]];
        if (distance(c, circle) < c.radius) {
          return true;
        }
      }
      return false;
    }

    function pathTween(set: VennSet): (t: number) => string {
      return (t: number) => {
        const c = set.sets.map((setId) => {
          const circle = circles![setId];
          const start = circle?.previous;
          const end = circle;

          if (!start) {
            return { x: end.x, y: end.y, radius: end.radius };
          }
          if (!end) {
            return { x: start.x, y: start.y, radius: start.radius };
          }
          if (t === 1 && circle) {
            delete circle.previous;
          }

          return {
            x: start.x * (1 - t) + end.x * t,
            y: start.y * (1 - t) + end.y * t,
            radius: start.radius * (1 - t) + end.radius * t,
          };
        });

        return intersectionAreaPath(c as Circle[]);
      };
    }

    return data;
  }

  function extractSets(data: any[]): Map<string, VennSet> {
    const sets = new Map<string, VennSet>();
    const individualSets = new Map<string, VennSet>();
    const accessor = opts.setsAccessor;
    const sizeFn = opts.setsSize;

    for (let i = 0; i < data.length; i++) {
      const setArray = accessor(data[i]);
      if (setArray.length) {
        const key = setArray.sort().join(',');

        setArray.forEach((val) => {
          if (individualSets.has(val)) {
            const s = individualSets.get(val)!;
            s.size++;
          } else {
            individualSets.set(val, {
              sets: [val],
              size: 1,
              __key__: val,
              nodes: [],
            });
          }
        });

        data[i].__setKey__ = key;
        if (sets.has(key)) {
          const s = sets.get(key)!;
          s.size++;
          s.nodes!.push(data[i]);
        } else {
          sets.set(key, {
            sets: setArray,
            size: 1,
            __key__: key,
            nodes: [data[i]],
          });
        }
      }
    }

    individualSets.forEach((v, k) => {
      if (!sets.has(k)) {
        sets.set(k, v);
      }
    });

    // Apply size function
    sets.forEach((v) => {
      v.size = sizeFn(v.size);
    });

    opts.sets = sets;
    return sets;
  }

  // Getter/setter methods
  (layout as any).packingConfig = function (_?: any) {
    if (!arguments.length) {
      return opts.packingConfig;
    }
    for (const k in _) {
      opts.packingConfig[k] = _[k];
    }
    if (packer) {
      applier(packer, _);
    }
    return layout;
  };

  (layout as any).packer = () => packer;
  (layout as any).circles = () => circles;
  (layout as any).centres = () => centres;
  (layout as any).centers = () => centres; // US spelling alias
  (layout as any).nodes = layout;
  (layout as any).sets = () => opts.sets;

  return layout;
}

export const version = '0.1.0';
