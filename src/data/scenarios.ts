import { MCQQuestion, BranchingScenario, CanvasCard, PeerProject } from "../types";

export const KNOWLEDGE_CHECK_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    text: "What is the first step in the AI Project Cycle?",
    options: [
      "Collect massive amounts of data",
      "Select an AI learning model",
      "Understand and define the Problem",
      "Create the visual output design"
    ],
    answerIndex: 2,
    explanation: "Before doing anything else, AI practitioners must clearly identify and define the problem they are trying to solve!"
  },
  {
    id: 2,
    text: "Which stage of the project cycle is responsible for gathering the right information?",
    options: [
      "Problem Stage",
      "Data Stage",
      "Model Stage",
      "Output Stage"
    ],
    answerIndex: 1,
    explanation: "The Data Stage is where we decide what information to collect, how to gather it, and how to organize it for the AI."
  },
  {
    id: 3,
    text: "Can an AI make accurate and useful predictions without high-quality, relevant data?",
    options: [
      "Yes, if the model is smart enough, it doesn't need data.",
      "Yes, the Output stage can generate data itself.",
      "No, AI needs representative and relevant data to learn patterns."
    ],
    answerIndex: 2,
    explanation: "AI models cannot make useful recommendations without data. As the saying goes: 'Garbage in, garbage out!'"
  },
  {
    id: 4,
    text: "Which stage of the AI Project Cycle generates recommendations or makes predictions?",
    options: [
      "Problem Stage",
      "Data Stage",
      "Model Stage",
      "Output Stage"
    ],
    answerIndex: 3,
    explanation: "While the Model learns the patterns, the Output Stage is where those predictions are displayed, evaluated, and used by people to make decisions!"
  }
];

export const BRANCHING_SCENARIOS: BranchingScenario[] = [
  {
    id: "cafeteria",
    name: "Cafeteria Waste",
    icon: "Utensils",
    shortDesc: "Reduce food waste in the school canteen",
    problemDesc: "The school cafeteria throws away kilos of edible food every single day. The principal wants an AI consultant to help them balance food preparation with actual student demand.",
    steps: {
      problem: {
        id: "problem",
        title: "Step 1: Define the Problem",
        question: "What is the primary problem we are trying to solve?",
        choices: [
          {
            text: "Reduce daily food waste in the school cafeteria",
            feedback: "Spot on! Clearly defining food waste as the problem allows us to focus our data collection and AI modeling directly on consumption patterns.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "Hire more teachers to monitor lunch behavior",
            feedback: "Not quite. While teachers keep order, they don't solve the logistical challenge of matching food supply with student appetite.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "Upgrade to faster school cafeteria Wi-Fi",
            feedback: "Incorrect. While Wi-Fi is great, it does not prevent food from going to waste in the trash!",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      },
      data: {
        id: "data",
        title: "Step 2: Collect the Data",
        question: "What information should the cafeteria AI collect to solve food waste?",
        choices: [
          {
            text: "Uniform color of students buying lunch",
            feedback: "Incorrect. The color of student clothing has zero correlation with how much food they eat!",
            isCorrect: false,
            scoreImpact: 5
          },
          {
            text: "Student birthdays and graduation years",
            feedback: "No. A student's birthday doesn't help us predict how many portions of pasta are consumed on a rainy Tuesday.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "Daily food consumption, menu types, and attendance records",
            feedback: "Excellent! Daily portion sales, menu preferences, weather, and student attendance are highly predictive data variables.",
            isCorrect: true,
            scoreImpact: 25
          }
        ]
      },
      model: {
        id: "model",
        title: "Step 3: Select the AI Model",
        question: "Which type of AI model approach is best suited for predicting lunch demand?",
        choices: [
          {
            text: "A Facial Recognition model to scan students",
            feedback: "Wrong. Scanning faces might identify who is in line, but it won't predict the volume of ingredients the kitchen should buy.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "A Predictive forecasting model to project portion demands",
            feedback: "Fantastic! A regression or predictive model can analyze historical attendance and menu data to project the exact number of meals needed.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "A Language Translation model to read international recipes",
            feedback: "Incorrect. The kitchen staff doesn't need recipe translation; they need portion size predictions!",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      },
      output: {
        id: "output",
        title: "Step 4: Design the Output",
        question: "What is the most practical and useful output for the cafeteria staff?",
        choices: [
          {
            text: "A daily chef dashboard showing predicted menu item portions to prepare",
            feedback: "Superb! Providing the chef with a dashboard showing exactly how many portions to cook prevents both under-cooking and over-cooking.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "A notification system reminding students to do their homework",
            feedback: "No. Homework reminders have nothing to do with saving food in the cafeteria.",
            isCorrect: false,
            scoreImpact: 5
          },
          {
            text: "A text message to parents detailing student nutrition",
            feedback: "Not quite. While nutrition logs are neat, they don't solve the cafeteria's physical kitchen overproduction problem.",
            isCorrect: false,
            scoreImpact: 10
          }
        ]
      }
    }
  },
  {
    id: "traffic",
    name: "School Traffic",
    icon: "Car",
    shortDesc: "Optimize drop-off and pick-up traffic",
    problemDesc: "The road outside school is blocked with idling cars during drop-off hours, creating safety hazards and heavy air pollution. The school safety team needs your help.",
    steps: {
      problem: {
        id: "problem",
        title: "Step 1: Define the Problem",
        question: "What is the primary problem we are trying to solve?",
        choices: [
          {
            text: "High school parking lot traffic congestion and safety hazards",
            feedback: "Great definition! Safety hazards and time delays from vehicle clustering is the core problem.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "Increasing student grades in mathematics",
            feedback: "Irrelevant. Traffic optimization will not impact math tests directly.",
            isCorrect: false,
            scoreImpact: 5
          },
          {
            text: "Selling more school transit bus tickets",
            feedback: "Not the core issue. Though busing helps, we must solve the physical congestion directly.",
            isCorrect: false,
            scoreImpact: 10
          }
        ]
      },
      data: {
        id: "data",
        title: "Step 2: Collect the Data",
        question: "Which dataset should our safety AI analyze?",
        choices: [
          {
            text: "Student social media profile pictures",
            feedback: "No! Pictures have absolutely nothing to do with physical car coordinates.",
            isCorrect: false,
            scoreImpact: 5
          },
          {
            text: "Car arrival timestamps, vehicle counts, and drop-off lane speeds",
            feedback: "Yes! Traffic density, specific bottleneck timestamps, and flow speeds are the perfect datasets.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "Historical fuel prices in the local city",
            feedback: "Incorrect. Gas prices do not dictate the immediate hour of student drop-offs.",
            isCorrect: false,
            scoreImpact: 10
          }
        ]
      },
      model: {
        id: "model",
        title: "Step 3: Select the AI Model",
        question: "What type of model fits this traffic density pattern?",
        choices: [
          {
            text: "A Music Recommendation system for the car radio",
            feedback: "Incorrect. Listening to jazz won't clear the physical blockage in the school lane!",
            isCorrect: false,
            scoreImpact: 5
          },
          {
            text: "An Image generation model to draw cool cars",
            feedback: "No. Generating car drawings does not solve a physical traffic gridlock.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "A Traffic flow simulation & congestion prediction model",
            feedback: "Excellent choice! It models vehicle behaviors to predict when gridlock will peak based on arrival timings.",
            isCorrect: true,
            scoreImpact: 25
          }
        ]
      },
      output: {
        id: "output",
        title: "Step 4: Design the Output",
        question: "How should the safety AI deliver its solution?",
        choices: [
          {
            text: "An app that gives parents personalized, staggered arrival time slots",
            feedback: "Brilliant! Dynamically scheduling drop-off times based on AI flow forecasts flattens the peak traffic volume.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "A billboard showing the school's high-contrast color scheme",
            feedback: "Wrong. A color billboard does not help dispatch or stagger arriving vehicles.",
            isCorrect: false,
            scoreImpact: 5
          },
          {
            text: "A automatic loudspeaker that yells at cars to drive faster",
            feedback: "Not helpful and highly disruptive! Shouting won't resolve physical queue limitations.",
            isCorrect: false,
            scoreImpact: 10
          }
        ]
      }
    }
  },
  {
    id: "plastic",
    name: "Plastic Recycling",
    icon: "Recycle",
    shortDesc: "Automate smart sorting of plastic waste",
    problemDesc: "Students are throwing plastic bottles, paper, and food scraps into the same bins, ruining the school's recycling efforts. The green club wants a smart recycling aid.",
    steps: {
      problem: {
        id: "problem",
        title: "Step 1: Define the Problem",
        question: "What is the primary problem we are trying to solve?",
        choices: [
          {
            text: "Inefficient waste sorting and recycling contamination",
            feedback: "Perfect! Sorting recyclables from wet waste at the point of disposal is the main hurdle.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "Designing prettier waste bins for the hallways",
            feedback: "No. Prettier bins don't stop people from throwing food scraps onto paper.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "Selling more plastic water bottles",
            feedback: "Incorrect. We want to reduce and sort waste, not accelerate plastic sales!",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      },
      data: {
        id: "data",
        title: "Step 2: Collect the Data",
        question: "What data is required to help an AI sort recycling?",
        choices: [
          {
            text: "Photos of labeled materials (plastic, glass, paper, organic)",
            feedback: "Excellent! High-quality labeled images are the primary training data for computer vision sorting.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "Sound recordings of crushing aluminum cans",
            feedback: "Not practical. Sound isn't as reliable or prompt as sight when a student places waste in a bin.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "List of top school academic achievers",
            feedback: "Incorrect. Grades have no relevance to training visual sensors to recognize plastic.",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      },
      model: {
        id: "model",
        title: "Step 3: Select the AI Model",
        question: "What AI capability can categorize waste from a camera?",
        choices: [
          {
            text: "Text translation to read labels in Spanish",
            feedback: "No. The AI needs to recognize unlabeled objects visually, not translate text.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "Computer Vision / Image Classification model",
            feedback: "Outstanding! An image classifier recognizes shapes, colors, and textures to distinguish plastic bottles from paper.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "A stock market prediction model",
            feedback: "Incorrect. We are sorting plastic bottles, not trading stock shares!",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      },
      output: {
        id: "output",
        title: "Step 4: Design the Output",
        question: "How should the smart recycling bin direct trash?",
        choices: [
          {
            text: "An automated bin lid that opens the correct flap when trash is scanned",
            feedback: "Spot on! An interactive physical feedback bin ensures 100% sorting accuracy at the disposal instant.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "A monthly printout of overall trash weights",
            feedback: "Too late. Printouts don't stop contamination when the waste is already mixed inside the dumpster.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "Playing loud heavy metal music when glass is scanned",
            feedback: "Yikes! That would terrify students and disrupt the school environment.",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      }
    }
  },
  {
    id: "study",
    name: "Study Assistant",
    icon: "BookOpen",
    shortDesc: "Help students plan homework schedules",
    problemDesc: "Students are stressed out because they get piled with multiple tests and assignments on the same day. They need an AI to help balance homework loading.",
    steps: {
      problem: {
        id: "problem",
        title: "Step 1: Define the Problem",
        question: "What is the primary problem we are trying to solve?",
        choices: [
          {
            text: "Student overwhelm due to uncoordinated homework deadlines",
            feedback: "Exactly! Balancing deadlines across different courses is the key problem to tackle.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "Making school textbooks lighter to carry",
            feedback: "While a physical relief, it does not solve the cognitive load of overlapping exam dates.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "Extending school summer break by four weeks",
            feedback: "Unrealistic. Homework stress still occurs during the active school semesters.",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      },
      data: {
        id: "data",
        title: "Step 2: Collect the Data",
        question: "What parameters should the planner AI analyze?",
        choices: [
          {
            text: "Course syllabi, assignment deadlines, and student study speeds",
            feedback: "Perfect! These inputs let the AI calculate and balance workload distribution.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "Students' favorite musical artists",
            feedback: "Irrelevant. Musical taste has no bearing on planning physical math homework durations.",
            isCorrect: false,
            scoreImpact: 5
          },
          {
            text: "Daily cafeteria menus",
            feedback: "Incorrect. What students eat won't tell the AI how long it takes to read a history chapter.",
            isCorrect: false,
            scoreImpact: 10
          }
        ]
      },
      model: {
        id: "model",
        title: "Step 3: Select the AI Model",
        question: "Which model logic handles task scheduling best?",
        choices: [
          {
            text: "Speech-to-text transcriber",
            feedback: "No. Transcribing speech won't mathematically distribute calendar items.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "A dynamic scheduling optimization / load-balancing algorithm",
            feedback: "Excellent! An optimization model calculates task durations and calendars them dynamically without overlap.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "A weather pattern prediction model",
            feedback: "Incorrect. Rain doesn't dictate whether a biology essay is due on Friday!",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      },
      output: {
        id: "output",
        title: "Step 4: Design the Output",
        question: "How should the student interface work?",
        choices: [
          {
            text: "A customized daily task feed that breaks down study units day-by-day",
            feedback: "Superb! A calendar feed that tells you exactly how much to do each day prevents cramming and reduces stress.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "A system that automatically emails teachers asking to cancel tests",
            feedback: "Haha, nice try! But teachers would block the app immediately.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "Changing the font size of assignments dynamically",
            feedback: "Useless. Making the font larger doesn't change the amount of work required.",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      }
    }
  },
  {
    id: "water",
    name: "Water Saver",
    icon: "Droplet",
    shortDesc: "Conserve school sprinkler water usage",
    problemDesc: "The school lawns are watered automatically on a basic timer, meaning sprinklers turn on even during heavy rain! The facilities manager wants to stop wasting water.",
    steps: {
      problem: {
        id: "problem",
        title: "Step 1: Define the Problem",
        question: "What is the primary problem we are trying to solve?",
        choices: [
          {
            text: "Excess water consumption due to uncoordinated irrigation schedules",
            feedback: "Yes! Matching sprinkler activity directly with real-world weather is the key problem.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "Making school grass grow twice as fast",
            feedback: "Incorrect. Faster grass growth actually increases the lawn mowers' work!",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "Changing the colors of the sprinkler pipes",
            feedback: "Irrelevant. Painting pipes does not stop water waste.",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      },
      data: {
        id: "data",
        title: "Step 2: Collect the Data",
        question: "What parameters should the water-saving AI collect?",
        choices: [
          {
            text: "Local soil moisture levels, humidity, and weather forecasts",
            feedback: "Excellent! Weather predictions combined with live soil moisture sensors form the perfect dataset.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "The average price of sprinkler heads",
            feedback: "No. Pricing lists do not indicate whether the soil is dry or saturated.",
            isCorrect: false,
            scoreImpact: 10
          },
          {
            text: "Number of students playing sports on the field",
            feedback: "Minor factor, but doesn't solve the weather mismatch irrigation issue.",
            isCorrect: false,
            scoreImpact: 5
          }
        ]
      },
      model: {
        id: "model",
        title: "Step 3: Select the AI Model",
        question: "Which model handles these environmental calculations?",
        choices: [
          {
            text: "An English vocabulary spelling checker",
            feedback: "Wrong. Spelling corrections do not irrigate lawns.",
            isCorrect: false,
            scoreImpact: 5
          },
          {
            text: "An environmental adaptive-control model",
            feedback: "Spot on! The model processes soil data and weather patterns to decide if watering is needed.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "An image generator of beautiful gardens",
            feedback: "Incorrect. Looking at pictures of gardens doesn't optimize physical school water meters.",
            isCorrect: false,
            scoreImpact: 10
          }
        ]
      },
      output: {
        id: "output",
        title: "Step 4: Design the Output",
        question: "How should the AI control irrigation?",
        choices: [
          {
            text: "A smart valve trigger that overrides the timer when soil is wet",
            feedback: "Fantastic! Directly switching off valves when sensors show damp soil directly saves thousands of gallons.",
            isCorrect: true,
            scoreImpact: 25
          },
          {
            text: "A SMS notification to students telling them it is raining",
            feedback: "Useless. Students already know it's raining, and they don't operate the sprinkler valves!",
            isCorrect: false,
            scoreImpact: 5
          },
          {
            text: "A spreadsheet report generated every six months",
            feedback: "Not immediate enough. Semi-annual spreadsheets don't prevent watering in the rain today.",
            isCorrect: false,
            scoreImpact: 10
          }
        ]
      }
    }
  }
];

export const CANVAS_SUGGESTED_ITEMS = {
  problems: [
    "School Library book tracking: Books are frequently misplaced and slow to check out manually.",
    "Bus Route Optimization: School buses take long, overlapping routes, wasting fuel and student time.",
    "Litter Detection: Trash is left on campus sports fields after games, attracting pests.",
    "Classroom Temperature Comfort: Classroom HVAC is frozen in some rooms and boiling in others.",
    "Energy conservation: Hallway and classroom lights are left on overnight and on weekends."
  ],
  datasets: [
    "Library: Book barcode logs, borrowing frequencies, RFID locations, and class schedules.",
    "Buses: Real-time GPS bus paths, student home addresses, traffic delays, and vehicle capacities.",
    "Litter: High-res aerial images of fields, clean vs littered field benchmarks, and game timelines.",
    "HVAC: Live room thermometers, classroom occupancy rates, outside air temperatures, and historical electricity bills.",
    "Lights: Overnight light sensor readings, security guard logs, school calendar dates, and switch timestamps."
  ],
  models: [
    "Image classification / Computer Vision: Scan bins or areas to count and identify trash items automatically.",
    "Predictive path routing / optimization models: Calculate and simulate shortest overlapping travel itineraries.",
    "Clustering / Classification: Categorize misfiled books by visual covers or RFID signal triangulation.",
    "Predictive thermal regression models: Adjust thermostat schedules dynamically based on forecast and occupancy.",
    "Threshold anomaly detection / scheduling AI: Automatically schedule shutdowns or alert facilities when lights remain on post-hours."
  ],
  outputs: [
    "A smart phone app for students showing exactly where misfiled books are on the library shelves.",
    "A dynamic route dispatch map for bus drivers showing the optimized travel path updated each morning.",
    "A robotic sweeping route or a safety guard notification showing trash hotspots highlighted on a map.",
    "An automated classroom thermostat control system that cuts school energy usage by 25%.",
    "A dashboard for the security manager that automatically powers down unnecessary grids at 8 PM."
  ]
};

export const WORKFLOW_STEPS = [
  "Understand Problem",
  "Collect Data",
  "Train Model",
  "Test AI",
  "Deploy Solution",
  "Improve AI"
];

export const PEER_PROJECTS: PeerProject[] = [
  {
    id: "project_a",
    name: "Project A: Smart Study Coach",
    desc: "A personalized study reminder helper.",
    collects: [
      "School timetables",
      "Course deadlines",
      "Self-reported difficulty of subjects"
    ],
    output: "A personalized daily calendar reminder with micro-study slots to balance exam stress.",
    reason: "Project A follows responsible AI design by collecting only minimal, relevant metadata that is directly tied to scheduling homework. It does not violate user privacy."
  },
  {
    id: "project_b",
    name: "Project B: Intrusive Study Coach",
    desc: "An over-engineered study tracker.",
    collects: [
      "Student account passwords",
      "Household family income",
      "Personal browser history",
      "Favorite paint colors"
    ],
    output: "A pushy reminder that ranks students on leaderboard grids and threatens point deductions.",
    reason: "Project B is highly irresponsible. It demands highly sensitive credentials (passwords), invasive logs (browser history), and financial data (income) that have absolutely zero relevance to planning academic studies. It represents toxic AI design."
  }
];
