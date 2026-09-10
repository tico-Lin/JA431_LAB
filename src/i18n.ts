import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    translation: {
      appName: 'Energy and Polymer Research Lab',
      nav: {
        home: 'Home',
        pi: 'PI Profile',
        overview: 'Overview',
        gapAnalysis: 'Collaboration Analysis',
        updateData: 'Research Data Admin',
      },
      controls: {
        themeLabel: 'Theme',
        languageLabel: 'Language',
        system: 'Follow System',
        light: 'Light',
        dark: 'Dark',
        english: 'English',
        traditionalChinese: 'Traditional Chinese',
      },
      common: {
        loadingData: 'Loading data...',
        noDataAvailable: 'No data available',
        failedToLoad: 'Failed to load data',
        spansPrefix: 'Spans',
        showLess: 'Show Less',
        moreCount: '+{{count}} more',
        emptyValue: '—',
      },
      home: {
        getStarted: 'Get Started',
        visitPiProfile: 'Visit PI Profile',
        viewResearchCapabilities: 'View Research Capabilities',
        teamMembers: 'PI / Team',
        skillsTracked: 'Research Capabilities',
        categories: 'Research Categories',
        aboutLab: 'About {{name}}',
        labDirector: 'Principal Investigator',
        keyFeatures: 'Research Focus',
        researchDirections: 'Research Directions',
        piProfileSource: 'Official PI Profile',
        piPublicationsSource: 'Publications',
        quickLinks: 'Quick Access',
        github: 'GitHub',
        templateProvided: 'Template Provided',
        labWebsite: 'Department Website',
        rightsReserved: 'All rights reserved.',
        failedConfig: 'Failed to load home page configuration',
      },
      pi: {
        profileTag: 'PI Profile',
        heroTitle: 'Assistant Professor Feng-Hao Hsu / PI',
        heroSubtitle: 'Energy and Polymer Research Lab',
        heroDescription:
          'The lab focuses on high-entropy doping and agricultural-waste green chemistry. We combine synthesis, thermal treatment, characterization, and electrochemical evaluation to support commissioned work, joint research, and materials validation.',
        contactRole: 'Principal Investigator',
        profileName: 'Feng-Hao Hsu',
        profileBio:
          'Assistant Professor with expertise in energy-storage materials, metal oxides, conducting polymers, graphene, and electrochemistry.',
        academicProfileTitle: 'Academic Background & Research Positioning',
        education:
          'Ph.D., Department of Materials Science and Engineering, National Chung Hsing University',
        researchPositioning:
          'Research integrates organic-inorganic energy-storage materials, from composition and interface design to operando structural analysis. Key applications include aluminum-ion batteries, supercapacitors, solid-state batteries, and multivalent-ion energy storage.',
        specialtiesItems: [
          'Energy-storage materials',
          'Conducting polymers',
          'Graphene nanocomposites',
          'Metal oxides',
          'High-entropy materials',
          'Electrochemistry',
          'Synchrotron radiation analysis',
        ],
        projectsTitle: 'Selected Research Projects',
        projectsItems: [
          {
            title:
              'Material-tuning strategies and performance mechanisms of two-dimensional molybdenum-carbon layered nanocomposites for aluminum-ion battery cathodes',
            period: '2026–2027',
            role: 'Principal Investigator',
          },
          {
            title:
              'Design, synthesis, properties, and energy-storage behavior of high-performance high-entropy oxides and nanocomposites',
            period: '2025–2026',
            role: 'Principal Investigator',
          },
          {
            title:
              'High-performance high-entropy materials for energy-storage electrodes and energy-storage mechanisms',
            period: '2024–2025',
            role: 'Principal Investigator',
          },
          {
            title:
              'Electrochemical properties of high-entropy layered double hydroxides for energy storage',
            period: '2026–2027',
            role: 'Undergraduate Research Project Advisor',
          },
        ],
        officeHoursLabel: 'Office hours: ',
        contactTitle: 'Contact',
        phone: '(04) 2632-8001 ext. 15205',
        email: 'hsu0625@pu.edu.tw',
        officeHours: 'Mon and Wed, 10:00–12:00; email appointment recommended',
        profileUrl: 'https://chem.pu.edu.tw/p/404-1108-40133.php?Lang=zh-tw',
        researchFocusItems: [
          {
            icon: 'highEntropyDoping',
            title: 'High-Entropy Doping',
            description:
              'Multi-element design for better structural stability, active sites, and energy-storage performance.',
            tags: [
              'High-entropy materials',
              'Multicomponent oxides',
              'Electrodes',
            ],
          },
          {
            icon: 'agriWasteGreenChemistry',
            title: 'Agri-Waste Green Chemistry',
            description:
              'Upcycling agricultural residues into functional carbons, composites, and precursor materials.',
            tags: ['Valorization', 'Green process', 'Circular economy'],
          },
          {
            icon: 'energyMaterialsApplications',
            title: 'Energy Materials Applications',
            description:
              'Focused on batteries, supercapacitors, and multivalent-ion storage with mechanism-driven interpretation.',
            tags: ['Batteries', 'Supercapacitors', 'Multivalent ions'],
          },
        ],
        methodsItems: [
          {
            icon: 'synthesisMethods',
            title: 'Material Synthesis',
            description:
              'Controlled routes for composition, phase, and morphology design.',
            tags: ['Hydrothermal', 'Electrodeposition', 'Co-precipitation'],
          },
          {
            icon: 'thermalTuning',
            title: 'Thermal and Atmosphere Tuning',
            description:
              'Control crystallinity, defects, and surface chemistry.',
            tags: ['High-temperature Annealing', 'Atmosphere Calcination'],
          },
          {
            icon: 'characterization',
            title: 'Structural Identification',
            description:
              'Resolve crystal phase, functional groups, and local chemical environments.',
            tags: ['XRD', 'FTIR', 'Raman', 'NMR'],
          },
          {
            icon: 'instrumentExperience',
            title: 'Morphology and Physical Properties',
            description:
              'Connect microstructure, thermal behavior, and surface area with performance.',
            tags: ['SEM', 'TEM', 'AFM', 'TGA', 'DSC', 'BET', 'DLS'],
          },
          {
            icon: 'characterization',
            title: 'Elemental Analysis',
            description:
              'Determine elemental composition, surface states, and concentrations.',
            tags: ['XPS', 'EDS', 'ICP-MS', 'AA'],
          },
          {
            icon: 'instrumentExperience',
            title: 'Synchrotron and Operando Analysis',
            description:
              'Follow structural and electronic changes during operation.',
            tags: [
              'Synchrotron XRD',
              'XAS',
              'In-situ XRD',
              'In-situ Raman',
              'In-situ FTIR',
              'In-situ XAS',
            ],
          },
          {
            icon: 'instrumentExperience',
            title: 'Electrochemical Evaluation',
            description:
              'Evaluate storage reactions, transport kinetics, and cycling stability.',
            tags: ['CV', 'GCD', 'EIS', 'GITT', 'PITT', 'CA', 'LSV'],
          },
        ],
        collaborationsItems: [
          'Materials synthesis and modification',
          'Agricultural-waste-derived material development',
          'Electrochemical evaluation and mechanism analysis',
          'Industry-academic collaboration and joint proposals',
        ],
        outputCategories: {
          publications: 'Publications',
          projects: 'Projects',
          conferences: 'Conferences',
          patents: 'Patents',
        },
        outputsItems: {
          publications: [
            {
              title:
                'Preparation and Properties of Polypyrrole/Molybdenum trioxide/Graphene Nanoribbon Ternary Nanocomposite as a Supercapacitor Electrode',
              meta: 'Ph.D. Thesis, National Chung Hsing University, 2017',
              href: 'https://link.springer.com/article/10.1007/s10008-015-3094-2',
            },
            {
              title:
                'Preparation and Characterization of Intrinsic Conducting Polymer/Graphene Nanocomposites',
              meta: 'Master’s Thesis, National Chung Hsing University, 2011',
              href: 'https://hdl.handle.net/11296/6357us',
            },
            {
              title:
                'W-doped α-phase molybdenum trioxide for aqueous aluminum-ion batteries',
              meta: 'Journal of Energy Storage, 2026',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S2352152X25042720',
            },
            {
              title:
                '2D MoO3 ion behavior in hydrated eutectic electrolyte for aluminum-ion energy storage',
              meta: 'Journal of Energy Storage, 2024',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S2352152X24002779',
            },
            {
              title:
                'Correlation of crystal structure and ion storage behavior of MoO3 electrode materials for aluminum-ion energy storage studied with in-situ X-ray spectroscopies',
              meta: 'Nanoscale, 2022',
              href: 'https://pubs.rsc.org/nr/article-abstract/14/20/7502/776332/Correlation-of-the-crystal-structure-and-ion?redirectedFrom=fulltext',
            },
            {
              title:
                'Electrochemical properties and mechanism of CoMoO4@NiWO4 core-shell nanoplates for high-performance supercapacitor electrode and studied with in-situ X-ray absorption spectroscopy',
              meta: 'Nanoscale, 2020',
              href: 'https://pubs.rsc.org/nr/article-abstract/12/25/13388/694162/Electrochemical-properties-and-mechanism-of-CoMoO4?redirectedFrom=fulltext',
            },
            {
              title:
                '1.8 V Aqueous Symmetric Carbon-Based Supercapacitors with Agarose-Bound Activated Carbons in an Acidic Electrolyte',
              meta: 'Nanomaterials, 2021',
              href: 'https://www.mdpi.com/2079-4991/11/7/1731',
            },
            {
              title:
                'The supercapacitor electrode properties and energy storage mechanism of binary transition metal sulfide MnCo2S4 compared with oxide MnCo2O4 studied using in situ quick X-ray absorption spectroscopy',
              meta: 'Materials Chemistry Frontiers, 2021',
              href: 'https://pubs.rsc.org/qm/article-abstract/5/13/4937/740387/The-supercapacitor-electrode-properties-and-energy?redirectedFrom=fulltext',
            },
            {
              title:
                'Facile synthesis of polypyrrole/carbon-coated MoO3 nanoparticle/graphene nanoribbon nanocomposite with high-capacitance applied in supercapacitor electrode',
              meta: 'Journal of Materials Science: Materials in Electronics, 2018',
              href: 'https://link.springer.com/article/10.1007/s10854-017-7927-x',
            },
            {
              title:
                'Poypyrrole/molybdenum trioxide/graphene nanoribbon ternary nanocomposite with enhanced capacitive performance as an electrode for supercapacitor',
              meta: 'Journal of Solid State Electrochemistry, 2015',
              href: 'https://link.springer.com/article/10.1007/s10008-015-3094-2',
            },
            {
              title:
                'Electrochemical characteristics of graphene nanoribbon/polypyrrole composite prepared via oxidation polymerization in the presence of poly-(sodium 4-styrenesulfonate)',
              meta: 'Materials Chemistry and Physics, 2015',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S0254058415301127',
            },
            {
              title:
                'Enhanced capacitance of one-dimensional polypyrrole/graphene oxide nanoribbon nanocomposite as electrode material for high performance supercapacitors',
              meta: 'Synthetic Metals, 2014',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S0379677914003555',
            },
            {
              title:
                'Enhanced conductivity and thermal stability of conductive polyaniline/graphene composite synthesized by in situ chemical oxidation polymerization with sodium dodecyl sulfate',
              meta: 'Synthetic Metals, 2013',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S0379677913004785',
            },
            {
              title:
                'In-situ synthesis and characterization of conductive polypyrrole/graphene composites with improved solubility and conductivity',
              meta: 'Synthetic Metals, 2012',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S0379677912000793',
            },
          ],
          projects: [
            {
              title:
                'Two-dimensional molybdenum-carbon nanocomposites for aluminum-ion battery cathodes',
              meta: 'NSTC Principal Investigator, 2026–2027',
              href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=115&code=QS01&organ=D,FD23,FD23B023&name=%e8%a8%b1%e5%b3%b0%e8%b1%aa',
            },
            {
              title:
                'High-performance high-entropy oxides and nanocomposites for energy storage',
              meta: 'Providence University Principal Investigator, 2025–2026',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                'High-entropy materials for energy-storage electrodes and mechanisms',
              meta: 'NSTC Principal Investigator, 2024–2025',
              href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=113&code=QS01&organ=D,FD23,FD23B023&name=%E8%A8%B1%E5%B3%B0%E8%B1%AA',
            },
            {
              title:
                'High-entropy layered double hydroxides for energy storage',
              meta: 'NSTC Undergraduate Project Advisor, 2026–2027',
              href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=115&code=QS05&organ=D%2cFD23%2cFD23B023&name=%E5%90%B3%E5%8F%99%E6%9D%AD',
            },
            {
              title:
                'Two-dimensional high-entropy materials for multivalent-ion energy-storage electrodes',
              meta: 'NSTC Principal Investigator, 2023–2024',
              href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=112&code=QS01&organ=D,FD23,FD23B023&name=%E8%A8%B1%E5%B3%B0%E8%B1%AA',
            },
            {
              title:
                'Local agricultural products: plastic reduction, value creation, safety, and applications',
              meta: 'Providence University Co-Principal Investigator, 2026–2027',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                'Green campus and green energy materials development and applications',
              meta: 'Providence University Co-Principal Investigator, 2023–2024',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
          ],
          conferences: [
            {
              title:
                'Multi-element molybdate electrode materials for supercapacitors',
              meta: '9th ICMDA, Sendai, 2026',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                'Ion behavior of α-MoO3 and h-MoO3 for aluminum-ion storage',
              meta: 'ICMENS, Fukuoka, 2025',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title: 'MoO3 electrode materials for aluminum-ion energy storage',
              meta: '7th ICMDA, Tokyo, 2024',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                'Energy-storage mechanism of CoMoO4@NiWO4 core-shell nanoplates',
              meta: 'Materials Annual Meeting, Taiwan, 2020',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                'Binary metal oxide NiWO4 coated on nickel foam for supercapacitors',
              meta: 'Physical Society of Taiwan Annual Meeting, Hsinchu, 2019',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                'Electrochemical capacitance and cycling stability of graphene nanoribbon/polypyrrole nanocomposites',
              meta: '32nd PPS, Lyon, 2016',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                'Preparation and characterization of one-dimensional polypyrrole nanostructures',
              meta: 'ICCE-21, Tenerife, 2013',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                'Preparation and characterization of conducting polypyrrole/graphene nanocomposites',
              meta: 'IUMRS-ICA, Busan, 2012',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                'Properties and energy-storage mechanism of CoMoO4@NiWO4 core-shell nanoplates studied via in-situ XAS',
              meta: 'Materials Annual Meeting, Taiwan, 2020',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
          ],
          patents: [
            {
              title:
                'Graphene nanoribbon/polypyrrole nanocomposite, manufacturing method, and supercapacitor',
              meta: 'Taiwan Patent I522416, 2016–2034',
              href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm05&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
            },
          ],
        },
        highlightsItems: [
          {
            title:
              'W-doped α-phase molybdenum trioxide with enhanced cycling stability as a cathode material for aqueous aluminum-ion batteries.',
            href: 'https://www.sciencedirect.com/science/article/abs/pii/S2352152X25042720',
          },
          {
            title:
              'The ion behavior and storage mechanism of 2D MoO3 layer structure in an air-stable hydrated eutectic electrolyte for aluminum-ion energy storage.',
            href: 'https://www.sciencedirect.com/science/article/abs/pii/S2352152X24002779',
          },
          {
            title:
              'PU high-performance high-entropy oxides and nanocomposites for energy-storage behavior studies.',
            href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=115&code=QS01&organ=D%2cFD23%2cFD23B023&name=%E8%A8%B1%E5%B3%B0%E8%B1%AA',
          },
          {
            title:
              'Advanced high-performance high-entropy materials for energy-storage electrodes and mechanism exploration.',
            href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=113&code=QS01&organ=D%2cFD23%2cFD23B023&name=%E8%A8%B1%E5%B3%B0%E8%B1%AA',
          },
        ],
        externalLinksItems: [
          {
            title: 'PI Profile',
            href: 'https://chem.pu.edu.tw/p/404-1108-40133.php?Lang=zh-tw',
          },
          {
            title: 'Publication List',
            href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
          },
          {
            title: 'Department Website',
            href: 'https://chem.pu.edu.tw/p/403-1108-30.php?Lang=zh-tw',
          },
          {
            title: 'Research Focus',
            href: 'https://chem.pu.edu.tw/p/412-1108-2247.php?Lang=zh-tw',
          },
          {
            title: 'Instrumentation',
            href: 'https://chem.pu.edu.tw/p/412-1108-2249.php?Lang=zh-tw',
          },
          {
            title: 'NSTC Researcher Profile',
            href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm02&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
          },
          {
            title: 'NSTC Publications',
            href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm03&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
          },
          {
            title: 'NSTC Patents',
            href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm05&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
          },
          {
            title: 'NSTC Project Overview',
            href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm17new&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
          },
        ],
        researchFocusTitle: 'Research Focus',
        coreCapabilitiesTitle: 'Core Capabilities',
        collaborationTitle: 'Collaboration Topics',
        outputsTitle: 'Selected Outputs and Projects',
        externalLinksTitle: 'External References',
        collaborationButton: 'Contact for collaboration',
        viewProfileButton: 'View PI profile',
      },
      overview: {
        title: 'Research Capability Overview',
        subtitle:
          'This page shows the lab’s research coverage. Overlapping regions indicate methods or instruments that support more than one focus area.',
        searchMembers: 'Search PI / keyword...',
        filterByCategory: 'Filter by research area',
        membersCount: 'Research Cards ({{count}})',
        noMembersMatch: 'No research cards match your filters',
      },
      gaps: {
        analyzing: 'Analyzing collaboration coverage...',
        title: 'Collaboration & Coverage Analysis',
        subtitle:
          'Identify which methods and instruments are already covered and where outside support or collaboration may be useful.',
        statNoCoverage: 'No Coverage',
        statNoExpert: 'No Expert',
        statHealthy: 'Well Covered',
        skillsSuffix: 'items',
        distTitle: 'Capability Distribution Overview',
        distSubtitle:
          'Inner ring shows research areas, outer ring shows methods and instruments. Click a category to filter, click a skill to see coverage details.',
        crossTitle: 'Cross-Area Capabilities',
        crossSubtitle:
          'These methods and instruments support multiple research directions and are strong collaboration points.',
        allCoverageTitle: 'All Skills Coverage',
        collaborationsTitle: 'Potential Collaboration Paths',
        noCoverageGoodNews:
          'Great news! All core capability areas are covered.',
        skillColumn: 'Capability',
        categoriesColumn: 'Research Areas',
        coverageColumn: 'Coverage',
        expertsColumn: 'Experts',
        statusColumn: 'Status',
        recommendationColumn: 'Recommendation',
        overlap: 'overlap',
        members: 'members',
        expertSingle: 'expert',
        expertPlural: 'experts',
        statusNoCoverage: 'No Coverage',
        statusNoExpert: 'No Expert',
        statusLimited: 'Limited',
        statusHealthy: 'Healthy',
        goodCoverage: 'Good coverage',
        collaborationHint:
          'Consider partnering with groups specializing in {{categories}}.',
        recommendationNoCoverage:
          'No coverage - consider collaboration or setup',
        recommendationNoExpert:
          'No experts - consider training or external support',
        recommendationSinglePoint: 'Single point of failure - expand coverage',
        people: 'people',
        selectCategory: 'Select a category',
        noTeamMembersWithSkill: 'No one in the current profile has this skill',
        none: 'None',
        expertiseDistribution: 'Expertise Distribution',
        proficiencyLevels: 'Proficiency Levels',
        viewDetailsBelow: 'View Details Below',
        skillsWord: 'Skills',
      },
      pr: {
        title: 'Research Data Admin & PR Generator',
        subtitle:
          'Add or update PI and research-capability data. Generate Pull Request content for data updates.',
        enterValidToken: 'Please enter a valid GitHub Personal Access Token',
        createPrSuccess: 'Pull Request created successfully!',
        createPrFailed: 'Failed: {{message}}',
        loading: 'Loading data...',
        copySuccess: 'PR content copied to clipboard!',
        addNew: 'Add new',
        update: 'Update',
        removeMemberTitle: 'Remove Profile: {{name}}',
        batchTitle: 'Batch Update: {{count}} changes',
        memberListTitle: 'Existing Profiles',
        addNewMember: 'Add New Profile',
        memberCount: '{{count}} skills',
        formNewMember: 'New Profile',
        formEditMember: 'Edit: {{name}}',
        name: 'Name',
        role: 'Role',
        email: 'Email',
        githubUsername: 'GitHub Username',
        namePlaceholder: 'John Doe',
        rolePlaceholder: 'PhD Student',
        roleKeys: [
          'professor',
          'postdoc',
          'phdStudent',
          'masterStudent',
          'undergraduateStudent',
          'researchAssistant',
          'visitingScholar',
          'alumni',
        ],
        roles: {
          professor: 'Professor',
          postdoc: 'Postdoc',
          phdStudent: 'PhD Student',
          masterStudent: 'Master Student',
          undergraduateStudent: 'Undergraduate Student',
          researchAssistant: 'Research Assistant',
          visitingScholar: 'Visiting Scholar',
          alumni: 'Alumni',
        },
        localizedNamesHeading: 'Localized Names',
        chineseNameLabel: 'Chinese',
        englishNameLabel: 'English',
        form: {
          nameZhLabel: 'Chinese Name',
          nameEnLabel: 'English Name',
          namePlaceholderZh: 'Feng-Hao Hsu',
          namePlaceholderEn: 'Feng-Hao Hsu',
        },
        emailPlaceholder: 'john@lab.edu',
        githubPlaceholder: 'johndoe',
        tokenPlaceholder: 'ghp_...',
        pleaseEnterName: 'Please enter name',
        pleaseEnterRole: 'Please enter role',
        skillsHint: 'Capabilities (click to add)',
        selectedSkills: 'Selected: {{count}} items',
        generatePrContent: 'Generate PR Content',
        removeMember: 'Remove Member',
        pullRequest: 'Pull Request',
        targetRepository: 'Target Repository',
        repoAutoDetect:
          'Repository auto-detected from GitHub Pages URL. You can edit if needed for custom domains.',
        repoOwnerPlaceholder: 'Repository Owner (e.g., your-username)',
        repoNamePlaceholder: 'Repository Name (e.g., JA431_LAB)',
        automaticPrCreation: 'Automatic PR Creation',
        tokenHelp:
          'Enter your GitHub Personal Access Token (PAT) to automatically create this PR.',
        requiredPermissions: 'Required Permissions:',
        tokenScopeRepo: 'repo (Full control of private repositories)',
        tokenScopeFine:
          'OR for Fine-grained tokens: Contents (Read & write) + Pull requests (Read & write)',
        generateTokenLink: "Click here to generate a token with 'repo' scope",
        createPr: 'Create PR',
        manualCreation: 'OR Manual Creation',
        close: 'Close',
        copyClipboard: 'Copy to Clipboard',
        adminTitle: 'Skill & Category Administration',
        pendingChanges: 'Pending Changes ({{count}})',
        clearAll: 'Clear All',
        generatePr: 'Generate PR',
        skillsSection: 'Skills',
        categoriesSection: 'Categories',
        addSkill: 'Add Skill',
        addCategory: 'Add Category',
        skillNameColumn: 'Skill Name',
        categoriesColumn: 'Categories',
        actionsColumn: 'Actions',
        categoryNameColumn: 'Category Name',
        colorColumn: 'Color',
        skillsCountColumn: 'Skills Count',
        invalidChangesTitle: 'Invalid Changes Detected',
        editCategory: 'Edit Category',
        addNewCategory: 'Add New Category',
        addToChanges: 'Add to Changes',
        categoryName: 'Category Name',
        categoryDescription: 'Description',
        categoryColor: 'Color',
        pleaseEnterCategoryName: 'Please enter category name',
        pleaseSelectColor: 'Please select a color',
        categoryNamePlaceholder: 'e.g., Machine Learning',
        categoryDescriptionPlaceholder: 'Brief description of the category',
        editSkill: 'Edit Skill',
        addNewSkill: 'Add New Skill',
        skillName: 'Skill Name',
        skillDescription: 'Description',
        skillCategories: 'Categories (select multiple for overlap)',
        pleaseEnterSkillName: 'Please enter skill name',
        pleaseSelectOneCategory: 'Select at least one category',
        skillNamePlaceholder: 'e.g., Computer Vision',
        skillDescriptionPlaceholder: 'Brief description of the skill',
        addSkillCardTitle: 'Add New Skill (with Category Overlap)',
        addSkillCardDescription:
          'Create a new skill that can span multiple categories. Skills with multiple categories create overlap regions in the visualization.',
        belongsToCategories:
          'Belongs to Categories (select multiple for overlap)',
        generateSkillPr: 'Generate Skill PR',
        tooltipEditSkill: 'Edit Skill',
        tooltipDeleteSkill: 'Delete Skill',
        tooltipEditCategory: 'Edit Category',
        tooltipDeleteCategory: 'Delete Category',
        tooltipCannotDelete: 'Cannot delete: Used by {{names}}',
        changeDeleteSkill: 'Delete skill "{{name}}"',
        changeDeleteCategory: 'Delete category "{{name}}"',
        changeUpdateCategory: 'Update category "{{name}}"{{details}}',
        changeAddCategory: 'Add new category "{{name}}"',
        changeAddSkill: 'Add new skill "{{name}}"',
        changeUpdateSkill: 'Update skill "{{name}}"{{details}}',
        templateMemberTitle: 'Lab Member',
        templateDescriptionHeading: 'Description',
        templateChangesHeading: 'Changes to public/data/skillsData.json',
        templateSkillsSummaryHeading: 'Skills Summary',
        templateCategoryDistributionHeading: 'Category Distribution',
        templateChecklistHeading: 'Checklist',
        templateAddsProfile:
          'This PR adds the profile for {{name}} ({{role}}).',
        templateUpdatesProfile:
          'This PR updates the profile for {{name}} ({{role}}).',
        templateAddMemberEntry:
          'Add the following member to the members array:',
        templateReplaceMemberEntry: 'Replace the existing member entry with:',
        templateSpans: 'spans',
        templateCategorySkills: '{{category}}: {{count}} skills',
        templateChecklistMemberInfo: 'Member information is accurate',
        templateChecklistSkillsAssigned: 'Skills are correctly assigned',
        templateChecklistProficiency: 'Proficiency levels are appropriate',
        templateRemoveMemberTitle: 'Remove Lab Member: {{name}}',
        templateRemoveDescription:
          'This PR removes the profile for {{name}} ({{role}}) from the lab members list.',
        templateRemoveEntry: 'Remove the member entry with ID {{id}}.',
        templateChecklistDeparture:
          'Confirmed member departure or removal request',
        templateBatchTitle: 'Batch Update: Skills & Categories',
        templateBatchDescription:
          'This PR contains {{count}} changes to skills and/or categories.',
        templateBatchSummaryHeading: 'Changes Summary',
        templateBatchDetailsHeading: 'Detailed Changes',
        templateChecklistAppropriate: 'All changes are appropriate',
        templateChecklistNoBreak: 'No breaking changes to existing data',
        branchCreateFailureHint:
          'Failed to create branch. Check Token Scopes (needs "repo") or Fork status.',
        repoNotFound:
          'Could not find repository {{owner}}/{{repo}}. Please ensure the repository exists.',
        branchCreateFailedRepo:
          'Failed to create branch on {{owner}}/{{repo}}. Ensure your token has "repo" scope.',
        unexpectedFileType: 'Unexpected file type in branch',
        autoDescription: 'Description for {{name}}',
        changeTypeAddSkill: 'ADD SKILL',
        changeTypeUpdateSkill: 'UPDATE SKILL',
        changeTypeDeleteSkill: 'DELETE SKILL',
        changeTypeAddCategory: 'ADD CATEGORY',
        changeTypeUpdateCategory: 'UPDATE CATEGORY',
        changeTypeDeleteCategory: 'DELETE CATEGORY',
        validationSkillReferencesDeletedCategory:
          'Skill "{{skill}}" references category "{{category}}" which is being deleted',
        validationCategoryUpdatedAndDeleted:
          'Category "{{name}}" is both being updated and deleted',
        validationSkillUpdatedAndDeleted:
          'Skill "{{name}}" is both being updated and deleted',
      },
      proficiency: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        expert: 'Expert',
      },
    },
  },
  'zh-TW': {
    translation: {
      appName: '能源及高分子研究室',
      nav: {
        home: '首頁',
        pi: 'PI介紹',
        overview: '總覽',
        gapAnalysis: '合作分析',
        updateData: '研究資料維護',
      },
      controls: {
        themeLabel: '主題',
        languageLabel: '語言',
        system: '跟隨系統',
        light: '淺色',
        dark: '深色',
        english: '英文',
        traditionalChinese: '繁體中文',
      },
      common: {
        loadingData: '載入資料中...',
        noDataAvailable: '目前沒有可用資料',
        failedToLoad: '資料載入失敗',
        spansPrefix: '橫跨',
        showLess: '收合',
        moreCount: '+{{count}} 項更多',
        emptyValue: '—',
      },
      home: {
        getStarted: '開始使用',
        visitPiProfile: '前往 PI 介紹頁',
        viewResearchCapabilities: '查看研究能力總覽',
        teamMembers: 'PI／研究成員',
        skillsTracked: '研究能力項目',
        categories: '研究分類',
        aboutLab: '關於 {{name}}',
        labDirector: '主持人',
        keyFeatures: '研究重點',
        researchDirections: '研究方向',
        piProfileSource: '官方 PI 資料',
        piPublicationsSource: '著作目錄',
        quickLinks: '快速入口',
        github: 'GitHub',
        templateProvided: '範本提供',
        labWebsite: '系所網站',
        rightsReserved: '版權所有。',
        failedConfig: '首頁設定載入失敗',
      },
      pi: {
        profileTag: 'PI 介紹',
        heroTitle: '許峰豪助理教授 / PI',
        heroSubtitle: '能源及高分子研究室',
        heroDescription:
          '本實驗室聚焦高熵參雜與農廢綠色化學，結合材料合成、熱處理修飾、結構表徵與電化學評估，提供外部委託、共同研究與材料驗證服務。',
        contactRole: '主持人',
        profileName: '許峰豪',
        profileBio:
          '助理教授，專長於儲能材料、金屬氧化物、導電高分子、石墨烯與電化學。',
        academicProfileTitle: '學術背景與研究定位',
        education: '國立中興大學材料科學與工程學系博士',
        researchPositioning:
          '研究結合有機與無機儲能材料，從材料組成、界面設計到原位結構分析，發展鋁離子電池、超級電容、固態電池與多價離子儲能等關鍵技術。',
        specialtiesItems: [
          '儲能材料',
          '導電高分子',
          '石墨烯奈米複材',
          '金屬氧化物',
          '高熵材料',
          '電化學',
          '同步輻射分析技術',
        ],
        projectsTitle: '代表性研究計畫',
        projectsItems: [
          {
            title:
              '二維鉬系碳基層狀奈米複合材料於鋁離子電池陰極之材料改質策略與性能提升機制研究',
            period: '2026–2027',
            role: '計畫主持人',
          },
          {
            title:
              'PU 高性能高熵氧化物及其奈米複合材料之設計、合成、性能與儲能行為研究',
            period: '2025–2026',
            role: '計畫主持人',
          },
          {
            title:
              '前瞻高性能高熵材料應用於儲能裝置電極材料與儲能機制之開發與研究',
            period: '2024–2025',
            role: '計畫主持人',
          },
          {
            title: '高熵層狀雙氫氧化物（MnCoNiCuZn）-Fe LDH 之電化學性能探討',
            period: '2026–2027',
            role: '大專生研究計畫指導老師',
          },
        ],
        officeHoursLabel: '辦公時間：',
        contactTitle: '聯絡資訊',
        phone: '(04) 2632-8001 分機 15205',
        email: 'hsu0625@pu.edu.tw',
        officeHours: '週一、週三 10:00–12:00，建議先以 email 預約',
        profileUrl: 'https://chem.pu.edu.tw/p/404-1108-40133.php?Lang=zh-tw',
        researchFocusItems: [
          {
            icon: 'highEntropyDoping',
            title: '高熵參雜',
            description:
              '以多元素協同設計提升材料的結構穩定性、活性位點與儲能表現。',
            tags: ['高熵材料', '多元氧化物', '儲能電極'],
          },
          {
            icon: 'agriWasteGreenChemistry',
            title: '農廢綠色化學',
            description:
              '將農業廢棄物轉化為具功能性的碳材、複合材料或前驅物，推動低碳與循環利用。',
            tags: ['資源化', '綠色製程', '循環經濟'],
          },
          {
            icon: 'energyMaterialsApplications',
            title: '能源材料應用',
            description:
              '以電池、超級電容與多價離子儲能為主要應用場景，強化電化學性能與機制分析。',
            tags: ['電池', '超級電容', '多價離子'],
          },
        ],
        methodsItems: [
          {
            icon: 'synthesisMethods',
            title: '材料合成',
            description: '以濕式化學與電鍍途徑控制材料的組成、晶相與形貌。',
            tags: ['水熱法', '電鍍法', '共沉澱法'],
          },
          {
            icon: 'thermalTuning',
            title: '熱處理與氣氛改質',
            description: '藉由熱處理與氣氛控制，調整結晶性、缺陷與表面化學。',
            tags: ['高溫退火', '氣氛鍛燒'],
          },
          {
            icon: 'characterization',
            title: '結構鑑定',
            description: '以互補光譜技術解析晶相、官能基與局部化學環境。',
            tags: ['XRD', 'FTIR', 'Raman', 'NMR'],
          },
          {
            icon: 'instrumentExperience',
            title: '形貌與物性分析',
            description:
              '連結微結構、比表面積、熱行為與分散狀態，評估材料性能。',
            tags: ['SEM', 'TEM', 'AFM', 'TGA', 'DSC', 'BET', 'DLS'],
          },
          {
            icon: 'characterization',
            title: '元素定性與定量',
            description:
              '從表面到體相分析元素組成、價態與濃度，確保材料配方可追溯。',
            tags: ['XPS', 'EDS', 'ICP-MS', 'AA'],
          },
          {
            icon: 'instrumentExperience',
            title: '同步輻射與原位分析',
            description: '以同步輻射與原位量測追蹤操作中的結構及電子狀態變化。',
            tags: [
              '同步輻射 XRD',
              'XAS',
              'In-situ XRD',
              'In-situ Raman',
              'In-situ FTIR',
              'In-situ XAS',
            ],
          },
          {
            icon: 'instrumentExperience',
            title: '電化學評估',
            description: '評估儲能反應、傳輸動力學、倍率能力與循環穩定性。',
            tags: ['CV', 'GCD', 'EIS', 'GITT', 'PITT', 'CA', 'LSV'],
          },
        ],
        collaborationsItems: [
          '材料合成與改質委託',
          '農廢衍生材料開發',
          '電化學性能測試與機制解析',
          '產學合作與共同計畫',
        ],
        outputCategories: {
          publications: '論文',
          projects: '計畫',
          conferences: '會議',
          patents: '專利',
        },
        outputsItems: {
          publications: [
            {
              title:
                'Preparation and Properties of Polypyrrole/Molybdenum trioxide/Graphene Nanoribbon Ternary Nanocomposite as a Supercapacitor Electrode',
              meta: '博士論文，國立中興大學，2017',
              href: 'https://link.springer.com/article/10.1007/s10008-015-3094-2',
            },
            {
              title:
                'Preparation and Characterization of Intrinsic Conducting Polymer/Graphene Nanocomposites',
              meta: '碩士論文，國立中興大學，2011',
              href: 'https://hdl.handle.net/11296/6357us',
            },
            {
              title:
                'W-doped α-phase molybdenum trioxide with enhanced cycling stability as a cathode material for aqueous aluminum-ion batteries',
              meta: 'Journal of Energy Storage，2026',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S2352152X25042720',
            },
            {
              title:
                'The ion behavior and storage mechanism of 2D MoO3 layer structure in an air-stable hydrated eutectic electrolyte for aluminum-ion energy storage',
              meta: 'Journal of Energy Storage，2024',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S2352152X24002779',
            },
            {
              title:
                'Correlation of crystal structure and ion storage behavior of MoO3 electrode materials for aluminum-ion energy storage studied with in-situ X-ray spectroscopies',
              meta: 'Nanoscale，2022',
              href: 'https://pubs.rsc.org/nr/article-abstract/14/20/7502/776332/Correlation-of-the-crystal-structure-and-ion?redirectedFrom=fulltext',
            },
            {
              title:
                'Electrochemical properties and mechanism of CoMoO4@NiWO4 core-shell nanoplates for high-performance supercapacitor electrode and studied with in-situ X-ray absorption spectroscopy',
              meta: 'Nanoscale，2020',
              href: 'https://pubs.rsc.org/nr/article-abstract/12/25/13388/694162/Electrochemical-properties-and-mechanism-of-CoMoO4?redirectedFrom=fulltext',
            },
            {
              title:
                '1.8 V Aqueous Symmetric Carbon-Based Supercapacitors with Agarose-Bound Activated Carbons in an Acidic Electrolyte',
              meta: 'Nanomaterials，2021',
              href: 'https://www.mdpi.com/2079-4991/11/7/1731',
            },
            {
              title:
                'The supercapacitor electrode properties and energy storage mechanism of binary transition metal sulfide MnCo2S4 compared with oxide MnCo2O4 studied using in situ quick X-ray absorption spectroscopy',
              meta: 'Materials Chemistry Frontiers，2021',
              href: 'https://pubs.rsc.org/qm/article-abstract/5/13/4937/740387/The-supercapacitor-electrode-properties-and-energy?redirectedFrom=fulltext',
            },
            {
              title:
                'Facile synthesis of polypyrrole/carbon-coated MoO3 nanoparticle/graphene nanoribbon nanocomposite with high-capacitance applied in supercapacitor electrode',
              meta: 'Journal of Materials Science: Materials in Electronics，2018',
              href: 'https://link.springer.com/article/10.1007/s10854-017-7927-x',
            },
            {
              title:
                'Poypyrrole/molybdenum trioxide/graphene nanoribbon ternary nanocomposite with enhanced capacitive performance as an electrode for supercapacitor',
              meta: 'Journal of Solid State Electrochemistry，2015',
              href: 'https://link.springer.com/article/10.1007/s10008-015-3094-2',
            },
            {
              title:
                'Electrochemical characteristics of graphene nanoribbon/polypyrrole composite prepared via oxidation polymerization in the presence of poly-(sodium 4-styrenesulfonate)',
              meta: 'Materials Chemistry and Physics，2015',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S0254058415301127',
            },
            {
              title:
                'Enhanced capacitance of one-dimensional polypyrrole/graphene oxide nanoribbon nanocomposite as electrode material for high performance supercapacitors',
              meta: 'Synthetic Metals，2014',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S0379677914003555',
            },
            {
              title:
                'Enhanced conductivity and thermal stability of conductive polyaniline/graphene composite synthesized by in situ chemical oxidation polymerization with sodium dodecyl sulfate',
              meta: 'Synthetic Metals，2013',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S0379677913004785',
            },
            {
              title:
                'In-situ synthesis and characterization of conductive polypyrrole/graphene composites with improved solubility and conductivity',
              meta: 'Synthetic Metals，2012',
              href: 'https://www.sciencedirect.com/science/article/abs/pii/S0379677912000793',
            },
          ],
          projects: [
            {
              title:
                '二維鉬系碳基層狀奈米複合材料於鋁離子電池陰極之材料改質策略與性能提升機制研究',
              meta: '國科會計畫主持人，2026–2027',
              href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=115&code=QS01&organ=D,FD23,FD23B023&name=%e8%a8%b1%e5%b3%b0%e8%b1%aa',
            },
            {
              title:
                'PU 高性能高熵氧化物及其奈米複合材料之設計、合成、性能與儲能行為研究',
              meta: '靜宜大學計畫主持人，2025–2026',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                '前瞻高性能高熵材料應用於儲能裝置電極材料與儲能機制之開發與研究',
              meta: '國科會計畫主持人，2024–2025',
              href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=113&code=QS01&organ=D,FD23,FD23B023&name=%E8%A8%B1%E5%B3%B0%E8%B1%AA',
            },
            {
              title: '高熵層狀雙氫氧化物（MnCoNiCuZn）-Fe LDH 之電化學性能探討',
              meta: '國科會大專生研究計畫指導老師，2026–2027',
              href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=115&code=QS05&organ=D%2cFD23%2cFD23B023&name=%E5%90%B3%E5%8F%99%E6%9D%AD',
            },
            {
              title:
                '二維高熵材料應用於多價離子儲能電極材料之性能與電化學機制研究',
              meta: '國科會計畫主持人，2023–2024',
              href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=112&code=QS01&organ=D,FD23,FD23B023&name=%E8%A8%B1%E5%B3%B0%E8%B1%AA',
            },
            {
              title: 'PU 在地農產之減塑、加值、安全與應用',
              meta: '靜宜大學共同主持人，2026–2027',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title: 'PU 綠色校園暨綠能材料之開發與應用',
              meta: '靜宜大學共同主持人，2023–2024',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
          ],
          conferences: [
            {
              title: '多元素鉬酸鹽電極材料應用於超級電容',
              meta: '第 9 屆 ICMDA，日本仙台，2026',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title: 'α-MoO3 與 h-MoO3 於鋁離子儲能的離子行為與性能',
              meta: 'ICMENS，日本福岡，2025',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title: 'MoO3 電極材料應用於鋁離子儲能之晶體結構與性能',
              meta: '第 7 屆 ICMDA，日本東京，2024',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title: 'CoMoO4@NiWO4 核殼奈米片的儲能機制',
              meta: '材料年會，臺灣，2020',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title: 'NiWO4 包覆鎳泡沫之二元金屬氧化物電極材料用於超級電容',
              meta: '臺灣物理年會，新竹，2019',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title:
                '石墨烯奈米帶／聚吡咯奈米複材的一維結構電化學電容與循環穩定性',
              meta: '第 32 屆 PPS，法國里昂，2016',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title: '一維聚吡咯奈米結構的製備與鑑定',
              meta: 'ICCE-21，西班牙特內里費，2013',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title: '導電聚吡咯／石墨烯奈米複材的製備與鑑定',
              meta: 'IUMRS-ICA，韓國釜山，2012',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
            {
              title: '以原位 XAS 技術研究 CoMoO4@NiWO4 核殼奈米片的儲能機制',
              meta: '材料年會，臺灣，2020',
              href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
            },
          ],
          patents: [
            {
              title: '帶狀奈米石墨烯／聚吡咯奈米複材、其製造方法及超級電容',
              meta: '臺灣專利 I522416，2016–2034',
              href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm05&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
            },
          ],
        },
        highlightsItems: [
          {
            title:
              'W-doped α-phase molybdenum trioxide with enhanced cycling stability as a cathode material for aqueous aluminum-ion batteries.',
            href: 'https://www.sciencedirect.com/science/article/abs/pii/S2352152X25042720',
          },
          {
            title:
              'The ion behavior and storage mechanism of 2D MoO3 layer structure in an air-stable hydrated eutectic electrolyte for aluminum-ion energy storage.',
            href: 'https://www.sciencedirect.com/science/article/abs/pii/S2352152X24002779',
          },
          {
            title:
              'PU 高性能高熵氧化物及其奈米複合材料之設計、合成、性能與儲能行為研究。',
            href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=115&code=QS01&organ=D%2cFD23%2cFD23B023&name=%E8%A8%B1%E5%B3%B0%E8%B1%AA',
          },
          {
            title:
              '前瞻高性能高熵材料應用於儲能裝置電極材料與儲能機制之開發與研究。',
            href: 'https://wsts.nstc.gov.tw/STSWeb/Award/AwardMultiQuery.aspx?year=113&code=QS01&organ=D%2cFD23%2cFD23B023&name=%E8%A8%B1%E5%B3%B0%E8%B1%AA',
          },
        ],
        externalLinksItems: [
          {
            title: '教授基礎介紹',
            href: 'https://chem.pu.edu.tw/p/404-1108-40133.php?Lang=zh-tw',
          },
          {
            title: '著作目錄',
            href: 'https://alcat.pu.edu.tw/_research/search/t_research.php?MjAyMjAmMTA4MjEy',
          },
          {
            title: '系所網站',
            href: 'https://chem.pu.edu.tw/p/403-1108-30.php?Lang=zh-tw',
          },
          {
            title: '研究重點',
            href: 'https://chem.pu.edu.tw/p/412-1108-2247.php?Lang=zh-tw',
          },
          {
            title: '儀器設備',
            href: 'https://chem.pu.edu.tw/p/412-1108-2249.php?Lang=zh-tw',
          },
          {
            title: '國科會研究人才資料',
            href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm02&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
          },
          {
            title: '國科會著作目錄',
            href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm03&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
          },
          {
            title: '國科會專利資料',
            href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm05&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
          },
          {
            title: '國科會計畫總覽',
            href: 'https://arspb.nstc.gov.tw/NSCWebFront/modules/talentSearch/talentSearch.do?action=initRsm17new&rsNo=c23bd64b872040a791b32a4e4e03a056&LANG=chi',
          },
        ],
        researchFocusTitle: '研究重點',
        coreCapabilitiesTitle: '核心能力',
        collaborationTitle: '合作委託方向',
        outputsTitle: '代表性成果與計畫',
        externalLinksTitle: '外部資訊連結',
        collaborationButton: '立即洽詢合作',
        viewProfileButton: '查看教授介紹',
      },
      overview: {
        title: '研究能力總覽',
        subtitle:
          '以研究能力為核心的視覺總覽。重疊區域代表方法或儀器可支援多個研究面向。',
        searchMembers: '搜尋 PI／關鍵字...',
        filterByCategory: '依研究面向篩選',
        membersCount: '研究卡片（{{count}}）',
        noMembersMatch: '沒有符合條件的研究卡片',
      },
      gaps: {
        analyzing: '正在分析合作覆蓋狀況...',
        title: '合作與覆蓋分析',
        subtitle: '快速看出哪些能力已具備、哪些能力適合外部委託或共同合作。',
        statNoCoverage: '無人覆蓋',
        statNoExpert: '無專家',
        statHealthy: '覆蓋良好',
        skillsSuffix: '項',
        distTitle: '能力分布總覽',
        distSubtitle:
          '內圈為研究面向，外圈為方法與儀器。點擊分類可篩選，點擊能力可查看覆蓋情形。',
        crossTitle: '跨面向能力',
        crossSubtitle: '這些方法與儀器可支援多個研究方向，是很好的合作切入點。',
        allCoverageTitle: '能力覆蓋總覽',
        collaborationsTitle: '可能的合作方向',
        noCoverageGoodNews: '好消息！所有核心能力都有覆蓋。',
        skillColumn: '能力',
        categoriesColumn: '研究面向',
        coverageColumn: '覆蓋度',
        expertsColumn: '專家數',
        statusColumn: '狀態',
        recommendationColumn: '建議',
        overlap: '重疊',
        members: '人',
        expertSingle: '位專家',
        expertPlural: '位專家',
        statusNoCoverage: '無覆蓋',
        statusNoExpert: '無專家',
        statusLimited: '有限',
        statusHealthy: '健康',
        goodCoverage: '覆蓋良好',
        collaborationHint: '可與專精於 {{categories}} 的團隊進一步合作。',
        recommendationNoCoverage: '尚無覆蓋 - 建議合作或建置',
        recommendationNoExpert: '尚無專家 - 建議培訓或外部支援',
        recommendationSinglePoint: '單點風險 - 建議擴充覆蓋',
        people: '人',
        selectCategory: '選擇一個分類',
        noTeamMembersWithSkill: '目前資料中沒有人具備此能力',
        none: '無',
        expertiseDistribution: '專長分布',
        proficiencyLevels: '熟練度等級',
        viewDetailsBelow: '查看下方詳情',
        skillsWord: '技能',
      },
      pr: {
        title: '研究資料維護與 PR 產生器',
        subtitle:
          '新增或更新 PI、研究成員與能力資料，並產生 Pull Request 內容。',
        enterValidToken: '請輸入有效的 GitHub Personal Access Token',
        createPrSuccess: 'Pull Request 建立成功！',
        createPrFailed: '建立失敗：{{message}}',
        loading: '載入資料中...',
        copySuccess: '已複製 PR 內容到剪貼簿！',
        addNew: '新增',
        update: '更新',
        removeMemberTitle: '移除資料：{{name}}',
        batchTitle: '批次更新：{{count}} 項變更',
        memberListTitle: '現有資料',
        addNewMember: '新增資料',
        memberCount: '{{count}} 項技能',
        formNewMember: '新增資料',
        formEditMember: '編輯：{{name}}',
        name: '姓名',
        role: '職稱',
        email: 'Email',
        githubUsername: 'GitHub 帳號',
        namePlaceholder: '王小明',
        rolePlaceholder: '博士生',
        roleKeys: [
          'professor',
          'postdoc',
          'phdStudent',
          'masterStudent',
          'undergraduateStudent',
          'researchAssistant',
          'visitingScholar',
          'alumni',
        ],
        roles: {
          professor: '教授',
          postdoc: '博士後研究員',
          phdStudent: '博士生',
          masterStudent: '碩士生',
          undergraduateStudent: '大學生',
          researchAssistant: '研究助理',
          visitingScholar: '訪問學者',
          alumni: '校友',
        },
        localizedNamesHeading: '雙語名稱',
        chineseNameLabel: '中文',
        englishNameLabel: 'English',
        form: {
          nameZhLabel: '中文姓名',
          nameEnLabel: 'English Name',
          namePlaceholderZh: '許峰豪',
          namePlaceholderEn: 'Feng-Hao Hsu',
        },
        emailPlaceholder: 'member@lab.edu',
        githubPlaceholder: 'your-github-id',
        tokenPlaceholder: 'ghp_...',
        pleaseEnterName: '請輸入姓名',
        pleaseEnterRole: '請輸入職稱',
        skillsHint: '能力（點擊可新增）',
        selectedSkills: '已選：{{count}} 項',
        generatePrContent: '產生 PR 內容',
        removeMember: '移除成員',
        pullRequest: 'Pull Request',
        targetRepository: '目標 Repository',
        repoAutoDetect: '已根據 GitHub Pages URL 自動偵測，可依需求手動修改。',
        repoOwnerPlaceholder: 'Repository 擁有者（例如 your-username）',
        repoNamePlaceholder: 'Repository 名稱（例如 JA431_LAB）',
        automaticPrCreation: '自動建立 PR',
        tokenHelp: '輸入 GitHub Personal Access Token（PAT）即可自動建立 PR。',
        requiredPermissions: '需要權限：',
        tokenScopeRepo: 'repo（完整存取 private repositories）',
        tokenScopeFine:
          '或 Fine-grained token：Contents（讀寫）+ Pull requests（讀寫）',
        generateTokenLink: '點此快速建立含 repo 權限的 Token',
        createPr: '建立 PR',
        manualCreation: '或手動建立',
        close: '關閉',
        copyClipboard: '複製到剪貼簿',
        adminTitle: '能力與分類管理',
        pendingChanges: '待處理變更（{{count}}）',
        clearAll: '全部清除',
        generatePr: '產生 PR',
        skillsSection: '能力',
        categoriesSection: '分類',
        addSkill: '新增能力',
        addCategory: '新增分類',
        skillNameColumn: '能力名稱',
        categoriesColumn: '研究面向',
        actionsColumn: '操作',
        categoryNameColumn: '分類名稱',
        colorColumn: '顏色',
        skillsCountColumn: '技能數',
        invalidChangesTitle: '偵測到無效變更',
        editCategory: '編輯分類',
        addNewCategory: '新增分類',
        addToChanges: '加入待處理變更',
        categoryName: '分類名稱',
        categoryDescription: '描述',
        categoryColor: '顏色',
        pleaseEnterCategoryName: '請輸入分類名稱',
        pleaseSelectColor: '請選擇顏色',
        categoryNamePlaceholder: '例如：Machine Learning',
        categoryDescriptionPlaceholder: '請輸入分類簡介',
        editSkill: '編輯能力',
        addNewSkill: '新增能力',
        skillName: '能力名稱',
        skillDescription: '描述',
        skillCategories: '研究面向（可複選以建立重疊）',
        pleaseEnterSkillName: '請輸入技能名稱',
        pleaseSelectOneCategory: '至少選擇一個分類',
        skillNamePlaceholder: '例如：水熱法',
        skillDescriptionPlaceholder: '請輸入技能簡介',
        addSkillCardTitle: '新增能力（可分類重疊）',
        addSkillCardDescription:
          '建立可屬於多個研究面向的新能力。多分類能力會在視覺化中形成重疊區域。',
        belongsToCategories: '所屬研究面向（可複選以建立重疊）',
        generateSkillPr: '產生能力 PR',
        tooltipEditSkill: '編輯能力',
        tooltipDeleteSkill: '刪除能力',
        tooltipEditCategory: '編輯分類',
        tooltipDeleteCategory: '刪除分類',
        tooltipCannotDelete: '無法刪除：已被 {{names}} 使用',
        changeDeleteSkill: '刪除能力「{{name}}」',
        changeDeleteCategory: '刪除分類「{{name}}」',
        changeUpdateCategory: '更新分類「{{name}}」{{details}}',
        changeAddCategory: '新增分類「{{name}}」',
        changeAddSkill: '新增能力「{{name}}」',
        changeUpdateSkill: '更新能力「{{name}}」{{details}}',
        templateMemberTitle: '研究資料',
        templateDescriptionHeading: '說明',
        templateChangesHeading: 'public/data/skillsData.json 變更內容',
        templateSkillsSummaryHeading: '能力摘要',
        templateCategoryDistributionHeading: '研究面向分布',
        templateChecklistHeading: '檢查清單',
        templateAddsProfile: '此 PR 新增 {{name}}（{{role}}）的資料。',
        templateUpdatesProfile: '此 PR 更新 {{name}}（{{role}}）的資料。',
        templateAddMemberEntry: '將以下資料加入 members 陣列：',
        templateReplaceMemberEntry: '以以下內容取代現有資料：',
        templateSpans: '橫跨',
        templateCategorySkills: '{{category}}：{{count}} 項',
        templateChecklistMemberInfo: '資料正確',
        templateChecklistSkillsAssigned: '能力指派正確',
        templateChecklistProficiency: '熟練度設定合理',
        templateRemoveMemberTitle: '移除研究資料：{{name}}',
        templateRemoveDescription:
          '此 PR 從研究資料清單移除 {{name}}（{{role}}）的資料。',
        templateRemoveEntry: '移除 ID 為 {{id}} 的資料項目。',
        templateChecklistDeparture: '已確認離職或移除需求',
        templateBatchTitle: '批次更新：能力與分類',
        templateBatchDescription: '此 PR 包含 {{count}} 項能力或分類變更。',
        templateBatchSummaryHeading: '變更摘要',
        templateBatchDetailsHeading: '詳細變更',
        templateChecklistAppropriate: '所有變更皆合理',
        templateChecklistNoBreak: '不會破壞既有資料相容性',
        branchCreateFailureHint:
          '建立分支失敗。請確認 Token 權限（需要 repo）或 Fork 設定。',
        repoNotFound:
          '找不到 Repository {{owner}}/{{repo}}，請確認該倉庫存在。',
        branchCreateFailedRepo:
          '無法在 {{owner}}/{{repo}} 建立分支，請確認 Token 具備 repo 權限。',
        unexpectedFileType: '分支中的檔案型別不符預期',
        autoDescription: '{{name}} 的說明',
        changeTypeAddSkill: '新增能力',
        changeTypeUpdateSkill: '更新能力',
        changeTypeDeleteSkill: '刪除能力',
        changeTypeAddCategory: '新增分類',
        changeTypeUpdateCategory: '更新分類',
        changeTypeDeleteCategory: '刪除分類',
        validationSkillReferencesDeletedCategory:
          '技能「{{skill}}」引用了即將刪除的分類「{{category}}」',
        validationCategoryUpdatedAndDeleted:
          '分類「{{name}}」同時被標記為更新與刪除',
        validationSkillUpdatedAndDeleted:
          '技能「{{name}}」同時被標記為更新與刪除',
      },
      proficiency: {
        beginner: '初學',
        intermediate: '中階',
        advanced: '進階',
        expert: '專家',
      },
    },
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh-TW'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: [],
    },
  });

export default i18n;
