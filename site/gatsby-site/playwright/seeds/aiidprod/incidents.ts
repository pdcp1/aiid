import { DBIncident } from '../../../server/interfaces';

const incidents: DBIncident[] = [
    {
        incident_id: 1,
        title: "Incident 1",
        description: "Incident 1 Description",
        date: "2020-01-01",
        "Alleged deployer of AI system": ["entity-1"],
        "Alleged developer of AI system": ["entity-2"],
        "Alleged harmed or nearly harmed parties": ["entity-3"],
        editors: ["6737a6e881955aa4905ccb04"],
        reports: [1],
        implicated_systems: ["entity-1"],
        created_at: new Date('2020-01-01'),

        // TODO: this aren't required but break the build if missing
        editor_notes: "",
        nlp_similar_incidents: [],
        editor_similar_incidents: [],
        editor_dissimilar_incidents: [],
        flagged_dissimilar_incidents: [],
    },
    {
        incident_id: 2,
        title: "Incident 2",
        description: "Incident 2 Description",
        date: "2020-01-01",
        "Alleged deployer of AI system": ["entity-1"],
        "Alleged developer of AI system": ["entity-2"],
        "Alleged harmed or nearly harmed parties": ["entity-3"],
        editors: ["6737a6e881955aa4905ccb04"],
        reports: [2],
        implicated_systems: ["entity-1"],
        created_at: new Date('2020-02-01'),

        // TODO: this aren't required but break the build if missing
        editor_notes: "",
        nlp_similar_incidents: [],
        editor_similar_incidents: [],
        editor_dissimilar_incidents: [],
        flagged_dissimilar_incidents: [],
    },
    {
        incident_id: 3,
        date: "2014-08-14",
        reports: [
            3,
            4,
            6,
            7,
            8,
        ],
        editor_notes: "",
        "Alleged deployer of AI system": [
            "starbucks"
        ],
        "Alleged developer of AI system": [
            "kronos"
        ],
        "Alleged harmed or nearly harmed parties": [
            "starbucks-employees"
        ],
        description: "Kronos’s scheduling algorithm and its use by Starbucks managers allegedly negatively impacted financial and scheduling stability for Starbucks employees, which disadvantaged wage workers.",
        title: "Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees",
        editors: [
            "619b47ea5eed5334edfa3bbc"
        ],
        nlp_similar_incidents: [
            {
                incident_id: 1,
                similarity: 0.9988328814506531
            },
        ],
        editor_similar_incidents: [],
        editor_dissimilar_incidents: [],
        flagged_dissimilar_incidents: [],
        embedding: {
            vector: [
                -0.06841292232275009,
                0.08255906403064728
            ],
            from_reports: [
                16,
                17
            ]
        },
        tsne: {
            x: 0.0487331398239335,
            y: 0.38604577108881916
        },
        // this field is currently present in the database but not mapped to any graphql fueld
        // "created_at": 1407974400000
        implicated_systems: ["entity-1"],
        created_at: new Date('2020-03-01'),
    },
    {
        incident_id: 4,
        date: "2014-08-14",
        reports: [
            9
        ],
        "Alleged deployer of AI system": [
            "entity-1"
        ],
        "Alleged developer of AI system": [],
        "Alleged harmed or nearly harmed parties": [],
        implicated_systems: [],
        description: "Test description 4",
        title: "Test title 4",
        editors: [
            "619b47ea5eed5334edfa3bbc"
        ],
        nlp_similar_incidents: [
            {
                incident_id: 1,
                similarity: 0.9988328814506531
            },
        ],
        editor_similar_incidents: [],
        editor_dissimilar_incidents: [],
        flagged_dissimilar_incidents: [],
        embedding: {
            vector: [
                -0.06841292232275009,
                0.08255906403064728
            ],
            from_reports: [
                16,
                17
            ]
        },
        tsne: {
            x: 0.0487331398239335,
            y: 0.38604577108881916
        },
        created_at: new Date('2020-04-01'),
        editor_notes: "",
    },
]

export default incidents;