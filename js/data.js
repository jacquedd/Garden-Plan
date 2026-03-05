// ═══════════════════════════════════════════════════════════
// Garden Planner — Data & Constants
// Catalogs, lookup tables, and configuration constants
// ═══════════════════════════════════════════════════════════

const DIRS = ["N","NE","E","SE","S","SW","W","NW"];
const DA = {N:0,NE:45,E:90,SE:135,S:180,SW:225,W:270,NW:315};

// ═══ 100 FLOWERS ═══
const FLOWERS = [
  ["Rose","🌹","#C62828"],["Tulip","🌷","#E91E63"],["Sunflower","🌻","#F9A825"],["Daisy","🌼","#FFF176"],["Lavender","💜","#7E57C2"],
  ["Peony","🌸","#F48FB1"],["Hydrangea","💠","#5C6BC0"],["Dahlia","🌺","#AD1457"],["Lily","🪷","#FF7043"],["Marigold","🟠","#EF6C00"],
  ["Orchid","🪻","#AB47BC"],["Chrysanthemum","🌼","#FFB300"],["Iris","💜","#5E35B1"],["Daffodil","🌼","#FDD835"],["Pansy","🟣","#6A1B9A"],
  ["Geranium","🌺","#D32F2F"],["Begonia","🌺","#E53935"],["Zinnia","🌸","#FF5722"],["Petunia","💜","#8E24AA"],["Snapdragon","🌸","#EC407A"],
  ["Carnation","🌸","#F06292"],["Aster","💜","#7B1FA2"],["Cosmos","🌸","#F8BBD0"],["Delphinium","💙","#1E88E5"],["Foxglove","💜","#9C27B0"],
  ["Hollyhock","🌸","#C2185B"],["Jasmine","⚪","#F5F5F5"],["Gardenia","⚪","#FAFAFA"],["Camellia","🌺","#B71C1C"],["Magnolia","🤍","#F3E5F5"],
  ["Lilac","💜","#CE93D8"],["Wisteria","💜","#BA68C8"],["Azalea","🌺","#E91E63"],["Rhododendron","🌺","#D81B60"],["Hibiscus","🌺","#C2185B"],
  ["Bougainvillea","🌸","#AD1457"],["Clematis","💜","#7B1FA2"],["Morning Glory","💙","#1565C0"],["Sweet Pea","🌸","#EC407A"],["Verbena","💜","#8E24AA"],
  ["Salvia","🔴","#B71C1C"],["Coneflower","🌼","#E65100"],["Black-Eyed Susan","🌼","#F57F17"],["Columbine","💜","#6A1B9A"],["Bleeding Heart","💗","#E91E63"],
  ["Anemone","🌸","#F48FB1"],["Ranunculus","🌼","#FFEB3B"],["Hellebore","💚","#558B2F"],["Crocus","💜","#7E57C2"],["Allium","💜","#9C27B0"],
  ["Agapanthus","💙","#1976D2"],["Amaryllis","🌺","#C62828"],["Bluebell","💙","#42A5F5"],["Buttercup","🌼","#FFD600"],["Calendula","🟠","#EF6C00"],
  ["Calla Lily","⚪","#EEEEEE"],["Candytuft","⚪","#F5F5F5"],["Celosia","🔴","#D32F2F"],["Clover","💚","#388E3C"],["Cornflower","💙","#1E88E5"],
  ["Dianthus","🌸","#E91E63"],["Echinacea","🌸","#8D6E63"],["Freesia","🌼","#FFD54F"],["Fritillaria","🟣","#6A1B9A"],["Gaillardia","🌼","#E65100"],
  ["Gladiolus","🌸","#C2185B"],["Heather","💜","#AB47BC"],["Heliotrope","💜","#7B1FA2"],["Hyacinth","💜","#5C6BC0"],["Impatiens","🌸","#EC407A"],
  ["Lantana","🟠","#E65100"],["Larkspur","💙","#1976D2"],["Liatris","💜","#8E24AA"],["Lobelia","💙","#1565C0"],["Lupine","💜","#7E57C2"],
  ["Mandevilla","🌸","#E91E63"],["Narcissus","🌼","#FDD835"],["Nasturtium","🟠","#EF6C00"],["Nemesia","🌸","#F06292"],["Nigella","💙","#42A5F5"],
  ["Oleander","🌸","#F48FB1"],["Osteospermum","💜","#AB47BC"],["Phlox","🌸","#EC407A"],["Plumeria","🤍","#FFF9C4"],["Poppy","🌺","#D32F2F"],
  ["Primrose","🌼","#FFEB3B"],["Protea","🌸","#AD1457"],["Queen Anne's Lace","⚪","#FAFAFA"],["Ranunculus","🌼","#FFD54F"],["Rose of Sharon","🌸","#C2185B"],
  ["Rudbeckia","🌼","#F57F17"],["Scabiosa","💜","#7E57C2"],["Sedum","💚","#689F38"],["Snow Drop","⚪","#F5F5F5"],["Statice","💜","#7B1FA2"],
  ["Stock","🌸","#EC407A"],["Sweet William","🌸","#D81B60"],["Tickseed","🌼","#FFD600"],["Torch Lily","🔴","#D84315"],["Trillium","⚪","#E8EAF6"],
  ["Tuberose","⚪","#FFFDE7"],["Veronica","💙","#1565C0"],["Viola","💜","#6A1B9A"],["Yarrow","🌼","#F9A825"],["Zephyr Lily","🤍","#FCE4EC"],
  ["Daylily","🧡","#E65100"],
];
const FLOWER_TYPES = FLOWERS.map(([name,icon,color]) => ({id:"fl-"+name.toLowerCase().replace(/[^a-z]/g,"-"),label:name,icon,color,w:1,h:1,cat:"flowers"}));

// ═══ 100 PRODUCE ═══
const PRODUCE = [
  // Vegetables
  ["Tomato","🍅","#C62828"],["Pepper","🫑","#2E7D32"],["Hot Pepper","🌶️","#BF360C"],["Carrot","🥕","#E65100"],["Corn","🌽","#F9A825"],
  ["Broccoli","🥦","#2E7D32"],["Lettuce","🥬","#558B2F"],["Cucumber","🥒","#33691E"],["Eggplant","🍆","#4A148C"],["Potato","🥔","#795548"],
  ["Sweet Potato","🍠","#BF360C"],["Onion","🧅","#F9A825"],["Garlic","🧄","#F5F5F5"],["Zucchini","🥒","#558B2F"],["Squash","🟡","#F57F17"],
  ["Pumpkin","🎃","#E65100"],["Celery","🥬","#689F38"],["Asparagus","🌿","#33691E"],["Green Bean","🫘","#2E7D32"],["Peas","🟢","#388E3C"],
  ["Radish","🔴","#C62828"],["Beet","🟣","#880E4F"],["Turnip","⚪","#E8EAF6"],["Cabbage","🥬","#388E3C"],["Cauliflower","⚪","#EEEEEE"],
  ["Brussels Sprout","🟢","#33691E"],["Kale","🥬","#1B5E20"],["Spinach","🥬","#2E7D32"],["Artichoke","🟢","#558B2F"],["Leek","🟢","#689F38"],
  ["Okra","🟢","#33691E"],["Chard","🥬","#C62828"],["Kohlrabi","💚","#7CB342"],["Rutabaga","🟡","#F9A825"],["Parsnip","⚪","#FFF9C4"],
  ["Endive","🥬","#689F38"],["Fennel","🌿","#9E9D24"],["Bok Choy","🥬","#558B2F"],["Arugula","🥬","#33691E"],["Watercress","🌿","#2E7D32"],
  ["Radicchio","🟣","#880E4F"],["Scallion","🟢","#388E3C"],["Shallot","🟤","#795548"],["Rhubarb","🔴","#C62828"],["Horseradish","⚪","#EEEEEE"],
  // Fruits
  ["Strawberry","🍓","#C62828"],["Blueberry","🫐","#283593"],["Raspberry","🔴","#B71C1C"],["Blackberry","⚫","#212121"],["Grape","🍇","#4A148C"],
  ["Watermelon","🍉","#2E7D32"],["Cantaloupe","🟠","#EF6C00"],["Honeydew","🟢","#C5E1A5"],["Apple Tree","🍎","#C62828"],["Pear Tree","🍐","#9E9D24"],
  ["Peach Tree","🍑","#FF8A65"],["Cherry Tree","🍒","#B71C1C"],["Plum Tree","🟣","#6A1B9A"],["Fig Tree","🟤","#4E342E"],["Lemon Tree","🍋","#F9A825"],
  ["Orange Tree","🍊","#E65100"],["Lime Tree","🟢","#33691E"],["Banana Plant","🍌","#F9A825"],["Avocado Tree","🥑","#33691E"],["Pomegranate","🔴","#B71C1C"],
  ["Kiwi Vine","🥝","#558B2F"],["Gooseberry","🟢","#689F38"],["Currant","🔴","#C62828"],["Elderberry","⚫","#37474F"],["Mulberry","🟣","#4A148C"],
  // Herbs
  ["Basil","🌿","#2E7D32"],["Mint","🌿","#00897B"],["Rosemary","🌿","#558B2F"],["Thyme","🌿","#689F38"],["Oregano","🌿","#33691E"],
  ["Parsley","🌿","#388E3C"],["Cilantro","🌿","#2E7D32"],["Dill","🌿","#7CB342"],["Chives","🌿","#558B2F"],["Sage","🌿","#78909C"],
  ["Tarragon","🌿","#689F38"],["Bay Laurel","🌿","#33691E"],["Lemongrass","🌿","#9E9D24"],["Chamomile","🌼","#FDD835"],["Lavender Herb","💜","#7E57C2"],
  ["Stevia","🌿","#43A047"],["Marjoram","🌿","#558B2F"],["Borage","💙","#1E88E5"],["Catnip","🌿","#66BB6A"],["Comfrey","💜","#7B1FA2"],
  ["Echinacea Herb","🌸","#AD1457"],["Feverfew","⚪","#F5F5F5"],["Ginger","🟡","#F9A825"],["Turmeric","🟠","#FF8F00"],["Lemon Balm","🌿","#7CB342"],
  ["Lovage","🌿","#33691E"],["Sorrel","🌿","#689F38"],["Hyssop","💙","#42A5F5"],["Savory","🌿","#558B2F"],["Anise","⚪","#EEEEEE"],
];
const PRODUCE_TYPES = PRODUCE.map(([name,icon,color]) => ({id:"pr-"+name.toLowerCase().replace(/[^a-z]/g,"-"),label:name,icon,color,w:1,h:1,cat:"produce"}));

// ═══ PREFAB TYPES ═══
const PREFAB_TYPES = [
  // Beds
  {id:"raised-bed",label:"Raised Bed",icon:"🌱",color:"#6B4226",w:4,h:8,cat:"beds"},
  {id:"garden-plot",label:"Garden Plot",icon:"🥕",color:"#5D8233",w:6,h:6,cat:"beds"},
  {id:"herb-garden",label:"Herb Garden",icon:"🌿",color:"#7BA05B",w:3,h:3,cat:"beds"},
  {id:"flower-bed",label:"Flower Bed",icon:"🌸",color:"#C9677E",w:5,h:3,cat:"beds"},
  {id:"veggie-row",label:"Veggie Row",icon:"🥬",color:"#558B2F",w:8,h:2,cat:"beds"},
  {id:"planter-box",label:"Planter Box",icon:"🌱",color:"#8D6E63",w:2,h:2,cat:"beds"},
  // Plants
  {id:"tree-large",label:"Large Tree",icon:"🌳",color:"#2D5F2D",w:3,h:3,cat:"plants"},
  {id:"tree-small",label:"Small Tree",icon:"🌲",color:"#3A7D44",w:2,h:2,cat:"plants"},
  {id:"shrub",label:"Shrub",icon:"🪴",color:"#4A8B5C",w:2,h:2,cat:"plants"},
  {id:"bush-row",label:"Hedge Row",icon:"🌳",color:"#2E7D32",w:8,h:1,cat:"plants"},
  {id:"fruit-tree",label:"Fruit Tree",icon:"🍎",color:"#43A047",w:3,h:3,cat:"plants"},
  {id:"berry-bush",label:"Berry Bush",icon:"🫐",color:"#5C6BC0",w:2,h:2,cat:"plants"},
  {id:"vine-trellis",label:"Vine Trellis",icon:"🍇",color:"#6D4C41",w:4,h:1,cat:"plants"},
  {id:"ornamental-grass",label:"Ornamental Grass",icon:"🌾",color:"#9E9D24",w:2,h:2,cat:"plants"},
  // Furniture
  {id:"patio-table",label:"Patio Table",icon:"🪑",color:"#6D4C41",w:3,h:3,cat:"furniture"},
  {id:"dining-set",label:"Dining Set",icon:"🍽️",color:"#795548",w:4,h:4,cat:"furniture"},
  {id:"lounge-chair",label:"Lounge Chair",icon:"🛋️",color:"#8D6E63",w:2,h:3,cat:"furniture"},
  {id:"garden-bench",label:"Garden Bench",icon:"🪑",color:"#5D4037",w:4,h:1,cat:"furniture"},
  {id:"umbrella",label:"Patio Umbrella",icon:"⛱️",color:"#E65100",w:3,h:3,cat:"furniture"},
  {id:"hammock",label:"Hammock",icon:"🏖️",color:"#FF8F00",w:4,h:2,cat:"furniture"},
  {id:"swing-set",label:"Swing Set",icon:"🎠",color:"#F44336",w:4,h:2,cat:"furniture"},
  {id:"adirondack",label:"Adirondack Chair",icon:"🪑",color:"#42A5F5",w:2,h:2,cat:"furniture"},
  {id:"picnic-table",label:"Picnic Table",icon:"🪵",color:"#4E342E",w:4,h:3,cat:"furniture"},
  {id:"daybed",label:"Outdoor Daybed",icon:"🛏️",color:"#BDBDBD",w:3,h:4,cat:"furniture"},
  {id:"sectional",label:"Sectional Sofa",icon:"🛋️",color:"#757575",w:5,h:4,cat:"furniture"},
  {id:"side-table",label:"Side Table",icon:"🔲",color:"#A1887F",w:1,h:1,cat:"furniture"},
  // Hardscape
  {id:"patio",label:"Patio",icon:"",color:"#9E9E9E",w:10,h:8,cat:"hardscape"},
  {id:"deck",label:"Deck",icon:"",color:"#8D6E63",w:12,h:8,cat:"hardscape"},
  {id:"walkway",label:"Walkway",icon:"",color:"#BCAAA4",w:2,h:8,cat:"hardscape"},
  {id:"stepping-stones",label:"Stepping Stones",icon:"",color:"#B0BEC5",w:1,h:6,cat:"hardscape"},
  {id:"retaining-wall",label:"Retaining Wall",icon:"",color:"#8D6E63",w:10,h:1,cat:"hardscape"},
  {id:"fire-pit",label:"Fire Pit",icon:"",color:"#BF360C",w:3,h:3,cat:"hardscape"},
  {id:"outdoor-kitchen",label:"Outdoor Kitchen",icon:"",color:"#616161",w:6,h:3,cat:"hardscape"},
  // Structures
  {id:"shed",label:"Shed",icon:"🏠",color:"#795548",w:6,h:4,cat:"structures"},
  {id:"greenhouse",label:"Greenhouse",icon:"🏡",color:"#A5D6A7",w:8,h:6,cat:"structures"},
  {id:"pergola",label:"Pergola",icon:"🏛️",color:"#A1887F",w:8,h:6,cat:"structures"},
  {id:"gazebo",label:"Gazebo",icon:"⛺",color:"#BCAAA4",w:5,h:5,cat:"structures"},
  {id:"arbor",label:"Arbor/Arch",icon:"🚪",color:"#6D4C41",w:2,h:1,cat:"structures"},
  {id:"playhouse",label:"Playhouse",icon:"🏠",color:"#EF5350",w:4,h:4,cat:"structures"},
  {id:"treehouse",label:"Treehouse",icon:"🌳",color:"#4E342E",w:3,h:3,cat:"structures"},
  {id:"doghouse",label:"Dog House",icon:"🐕",color:"#8D6E63",w:2,h:2,cat:"structures"},
  {id:"chicken-coop",label:"Chicken Coop",icon:"🐔",color:"#D7CCC8",w:4,h:3,cat:"structures"},
  // Cooking & Entertaining
  {id:"grill",label:"Grill / BBQ",icon:"🔥",color:"#424242",w:2,h:2,cat:"entertain"},
  {id:"smoker",label:"Smoker",icon:"🔥",color:"#37474F",w:2,h:2,cat:"entertain"},
  {id:"pizza-oven",label:"Pizza Oven",icon:"🍕",color:"#6D4C41",w:3,h:2,cat:"entertain"},
  {id:"bar-cart",label:"Bar Cart",icon:"🍹",color:"#5D4037",w:2,h:1,cat:"entertain"},
  {id:"hot-tub",label:"Hot Tub",icon:"🛁",color:"#0288D1",w:3,h:3,cat:"entertain"},
  {id:"pool",label:"Swimming Pool",icon:"🏊",color:"#29B6F6",w:8,h:5,cat:"entertain"},
  {id:"trampoline",label:"Trampoline",icon:"⭕",color:"#263238",w:4,h:4,cat:"entertain"},
  {id:"sandbox",label:"Sandbox",icon:"🏖️",color:"#FFD54F",w:3,h:3,cat:"entertain"},
  {id:"cornhole",label:"Cornhole Set",icon:"🎯",color:"#5D4037",w:2,h:4,cat:"entertain"},
  {id:"fireplace",label:"Outdoor Fireplace",icon:"🔥",color:"#795548",w:3,h:2,cat:"entertain"},
  // Water
  {id:"fountain",label:"Fountain",icon:"⛲",color:"#81D4FA",w:2,h:2,cat:"water"},
  {id:"pond",label:"Pond",icon:"💧",color:"#4FC3F7",w:4,h:4,cat:"water"},
  {id:"birdbath",label:"Birdbath",icon:"🐦",color:"#90A4AE",w:1,h:1,cat:"water"},
  {id:"waterfall",label:"Waterfall",icon:"💦",color:"#4DD0E1",w:3,h:2,cat:"water"},
  {id:"rain-garden",label:"Rain Garden",icon:"🌧️",color:"#66BB6A",w:4,h:3,cat:"water"},
  {id:"irrigation",label:"Irrigation Line",icon:"💧",color:"#0277BD",w:10,h:1,cat:"water"},
  // Decor & Other
  {id:"compost",label:"Compost Bin",icon:"♻️",color:"#5D4037",w:2,h:2,cat:"other"},
  {id:"water-barrel",label:"Rain Barrel",icon:"🛢️",color:"#1565C0",w:1,h:1,cat:"other"},
  {id:"bird-feeder",label:"Bird Feeder",icon:"🐦",color:"#FF8F00",w:1,h:1,cat:"other"},
  {id:"bird-house",label:"Birdhouse",icon:"🏠",color:"#FFCC80",w:1,h:1,cat:"other"},
  {id:"garden-statue",label:"Garden Statue",icon:"🗿",color:"#9E9E9E",w:1,h:1,cat:"other"},
  {id:"solar-light",label:"Solar Light",icon:"💡",color:"#FFF176",w:1,h:1,cat:"other"},
  {id:"string-lights",label:"String Lights",icon:"✨",color:"#FFECB3",w:6,h:1,cat:"other"},
  {id:"lawn",label:"Lawn Area",icon:"🟩",color:"#8BC34A",w:10,h:10,cat:"other"},
  {id:"fence-sm",label:"Fence (Small)",icon:"🔲",color:"#8D6E63",w:6,h:6,cat:"other"},
  {id:"fence-md",label:"Fence (Medium)",icon:"🔲",color:"#8D6E63",w:10,h:8,cat:"other"},
  {id:"fence-lg",label:"Fence (Large)",icon:"🔲",color:"#8D6E63",w:15,h:12,cat:"other"},
  {id:"fence-wide",label:"Fence (Wide)",icon:"🔲",color:"#8D6E63",w:20,h:10,cat:"other"},
  {id:"fence-custom",label:"Fence (4×4)",icon:"🔲",color:"#8D6E63",w:4,h:4,cat:"other"},
  {id:"fence-run",label:"Fence Run (H)",icon:"▬",color:"#8D6E63",w:10,h:1,cat:"other"},
  {id:"fence-run-v",label:"Fence Run (V)",icon:"▮",color:"#8D6E63",w:1,h:10,cat:"other"},
  {id:"fence-gate-h",label:"Gate (H)",icon:"🚪",color:"#795548",w:3,h:1,cat:"other"},
  {id:"fence-gate-v",label:"Gate (V)",icon:"🚪",color:"#795548",w:1,h:3,cat:"other"},
  {id:"planter-pot",label:"Planter Pot",icon:"🪴",color:"#A1887F",w:1,h:1,cat:"other"},
  {id:"flag-pole",label:"Flag Pole",icon:"🏁",color:"#BDBDBD",w:1,h:1,cat:"other"},
  {id:"mailbox",label:"Mailbox",icon:"📫",color:"#1565C0",w:1,h:1,cat:"other"},
  {id:"rock-boulder",label:"Boulder",icon:"🪨",color:"#757575",w:2,h:2,cat:"other"},
  {id:"wood-pile",label:"Wood Pile",icon:"🪵",color:"#5D4037",w:3,h:2,cat:"other"},
  {id:"trash-cans",label:"Trash Cans",icon:"🗑️",color:"#455A64",w:2,h:1,cat:"other"},
  ...FLOWER_TYPES,
  ...PRODUCE_TYPES,
];

// ═══ DRAW BRUSH TYPES ═══
const DRAW_TYPES = [
  {id:"d-bed",label:"Raised Bed",icon:"🌱",color:"#6B4226",cat:"beds"},
  {id:"d-plot",label:"Garden Plot",icon:"🥕",color:"#5D8233",cat:"beds"},
  {id:"d-herb",label:"Herb Garden",icon:"🌿",color:"#7BA05B",cat:"beds"},
  {id:"d-flower",label:"Flower Bed",icon:"🌸",color:"#C9677E",cat:"beds"},
  {id:"d-path",label:"Path",icon:"",color:"#B8956A",cat:"hardscape"},
  {id:"d-patio",label:"Patio",icon:"",color:"#9E9E9E",cat:"hardscape"},
  {id:"d-gravel",label:"Gravel",icon:"",color:"#BDBDBD",cat:"hardscape"},
  {id:"d-pond",label:"Pond",icon:"💧",color:"#4FC3F7",cat:"water"},
  {id:"d-lawn",label:"Lawn",icon:"🟩",color:"#8BC34A",cat:"other"},
  {id:"d-mulch",label:"Mulch",icon:"🟫",color:"#795548",cat:"other"},
];

// ═══ CATEGORIES ═══
const CATS = [
  {id:"beds",label:"Beds",icon:"🌱"},{id:"flowers",label:"Flowers",icon:"🌺"},{id:"produce",label:"Produce",icon:"🥕"},{id:"plants",label:"Trees",icon:"🌳"},
  {id:"furniture",label:"Furniture",icon:"🪑"},{id:"entertain",label:"Fun & Cook",icon:"🔥"},
  {id:"hardscape",label:"Hardscape",icon:"🟫"},{id:"structures",label:"Structures",icon:"🏠"},
  {id:"water",label:"Water",icon:"💧"},{id:"other",label:"Decor",icon:"✨"},
];

// ═══ LAYER ORDERING ═══
// Ground surfaces < structures/plants < furniture/decor
const LAYER = {beds:1,hardscape:1,other:2,water:2,plants:3,structures:3,entertain:4,furniture:4,flowers:5,produce:5};

// ═══ LOOKUP SETS ═══
const ROUND_IDS = new Set(["tree-large","tree-small","shrub","fountain","compost","water-barrel","pond","herb-garden","fruit-tree","berry-bush","ornamental-grass","fire-pit","hot-tub","trampoline","sandbox","birdbath","umbrella","bird-feeder","bird-house","garden-statue","solar-light","planter-pot","flag-pole","rock-boulder"]);
const FENCE_IDS = new Set(["fence-sm","fence-md","fence-lg","fence-wide","fence-custom","fence-run","fence-run-v"]);
const GATE_IDS = new Set(["fence-gate-h","fence-gate-v"]);

// ═══ ICON LIBRARY ═══
const ICON_LIB = [
  // Flowers & Plants
  {e:"🌹",t:"rose flower"},{e:"🌷",t:"tulip flower"},{e:"🌻",t:"sunflower flower"},{e:"🌼",t:"daisy flower blossom"},{e:"🌸",t:"cherry blossom flower"},{e:"🌺",t:"hibiscus flower"},{e:"🪷",t:"lotus lily flower"},{e:"🪻",t:"hyacinth lavender flower"},{e:"💐",t:"bouquet flowers"},{e:"🌿",t:"herb leaf green"},{e:"🍀",t:"clover lucky four leaf"},{e:"☘️",t:"shamrock clover"},{e:"🌱",t:"seedling sprout plant"},{e:"🪴",t:"potted plant houseplant"},{e:"🌾",t:"rice wheat grain grass"},{e:"🌵",t:"cactus succulent desert"},{e:"🍁",t:"maple leaf autumn fall"},{e:"🍂",t:"fallen leaf autumn"},{e:"🍃",t:"leaf wind green"},{e:"🪹",t:"nest bird"},{e:"🪺",t:"nest eggs bird"},
  // Trees & Shrubs
  {e:"🌳",t:"tree deciduous oak"},{e:"🌲",t:"evergreen pine tree"},{e:"🌴",t:"palm tree tropical"},{e:"🎄",t:"christmas tree pine"},{e:"🎋",t:"tanabata bamboo tree"},{e:"🎍",t:"bamboo decoration pine"},{e:"🪵",t:"wood log timber"},{e:"🪨",t:"rock stone boulder"},
  // Fruits & Berries
  {e:"🍎",t:"apple red fruit"},{e:"🍏",t:"apple green fruit"},{e:"🍐",t:"pear fruit"},{e:"🍊",t:"orange tangerine citrus fruit"},{e:"🍋",t:"lemon citrus fruit"},{e:"🍌",t:"banana fruit"},{e:"🍉",t:"watermelon fruit"},{e:"🍇",t:"grapes vine fruit"},{e:"🍓",t:"strawberry berry fruit"},{e:"🫐",t:"blueberry berry fruit"},{e:"🍒",t:"cherries cherry fruit"},{e:"🍑",t:"peach fruit"},{e:"🥭",t:"mango fruit"},{e:"🍍",t:"pineapple fruit"},{e:"🥥",t:"coconut palm fruit"},{e:"🥝",t:"kiwi fruit"},{e:"🫒",t:"olive fruit"},{e:"🍈",t:"melon fruit"},
  // Vegetables & Herbs
  {e:"🥕",t:"carrot vegetable root"},{e:"🥬",t:"leafy green lettuce vegetable"},{e:"🥒",t:"cucumber vegetable"},{e:"🌶️",t:"hot pepper chili"},{e:"🫑",t:"bell pepper vegetable"},{e:"🌽",t:"corn maize vegetable"},{e:"🥦",t:"broccoli vegetable"},{e:"🧄",t:"garlic bulb"},{e:"🧅",t:"onion bulb"},{e:"🥔",t:"potato vegetable"},{e:"🍆",t:"eggplant aubergine"},{e:"🍅",t:"tomato vegetable"},{e:"🫘",t:"beans legume"},{e:"🥜",t:"peanut nut"},{e:"🫛",t:"pea pod"},{e:"🥗",t:"salad green bowl"},{e:"🧑‍🌾",t:"farmer gardener"},
  // Garden & Nature
  {e:"🦋",t:"butterfly insect garden"},{e:"🐝",t:"bee honeybee pollinator"},{e:"🐛",t:"bug caterpillar insect"},{e:"🐞",t:"ladybug beetle insect"},{e:"🪲",t:"beetle insect"},{e:"🐌",t:"snail garden"},{e:"🪱",t:"worm earthworm soil"},{e:"🐜",t:"ant insect"},{e:"🦗",t:"cricket grasshopper insect"},{e:"🕷️",t:"spider web"},{e:"🐦",t:"bird songbird"},{e:"🐦‍⬛",t:"black bird crow"},{e:"🦜",t:"parrot bird tropical"},{e:"🐓",t:"rooster chicken"},{e:"🐔",t:"chicken hen"},{e:"🐇",t:"rabbit bunny"},{e:"🦔",t:"hedgehog"},{e:"🐿️",t:"squirrel chipmunk"},{e:"🐕",t:"dog pet"},{e:"🐈",t:"cat pet"},{e:"🦎",t:"lizard reptile"},{e:"🐸",t:"frog toad"},{e:"🐢",t:"turtle tortoise"},{e:"🐟",t:"fish pond"},{e:"🦆",t:"duck bird pond"},
  // Weather & Sky
  {e:"☀️",t:"sun sunny"},{e:"🌤️",t:"sun cloud"},{e:"⛅",t:"cloud sun"},{e:"🌧️",t:"rain cloud"},{e:"🌈",t:"rainbow"},{e:"❄️",t:"snowflake winter"},{e:"💧",t:"water drop droplet"},{e:"💦",t:"splash water sweat"},{e:"🌊",t:"wave water ocean"},{e:"☁️",t:"cloud"},
  // Tools & Garden Equipment
  {e:"🔧",t:"wrench tool"},{e:"🪓",t:"axe hatchet tool"},{e:"⛏️",t:"pick mining tool"},{e:"🔨",t:"hammer tool"},{e:"🪣",t:"bucket pail"},{e:"🧹",t:"broom sweep"},{e:"🪜",t:"ladder step"},{e:"⚙️",t:"gear settings"},{e:"🛠️",t:"tools wrench"},{e:"🧰",t:"toolbox"},{e:"🪤",t:"trap mouse"},{e:"🏷️",t:"tag label"},{e:"📌",t:"pin pushpin"},
  // Structures & Objects
  {e:"🏠",t:"house home"},{e:"🏡",t:"house garden"},{e:"⛺",t:"tent camping"},{e:"🏛️",t:"classical building columns"},{e:"🚪",t:"door gate"},{e:"🪑",t:"chair seat"},{e:"🛋️",t:"couch sofa"},{e:"🛏️",t:"bed"},{e:"🍽️",t:"plate fork knife dining"},{e:"🏖️",t:"beach umbrella"},{e:"⛱️",t:"umbrella parasol shade"},{e:"🎪",t:"tent circus"},{e:"⛲",t:"fountain water"},{e:"🏊",t:"pool swim"},{e:"🛁",t:"bath tub hot tub"},{e:"🔥",t:"fire flame grill"},{e:"💡",t:"light bulb idea"},{e:"🪔",t:"lamp oil diya"},{e:"🕯️",t:"candle"},{e:"✨",t:"sparkles stars"},{e:"⭐",t:"star"},{e:"🌟",t:"glowing star"},{e:"🎯",t:"target bullseye"},{e:"🎠",t:"carousel horse playground"},{e:"♻️",t:"recycle compost"},{e:"🗿",t:"statue moai"},{e:"🪵",t:"log wood"},{e:"🧱",t:"brick wall"},
  // Symbols & Markers
  {e:"🟢",t:"green circle dot"},{e:"🔴",t:"red circle dot"},{e:"🟡",t:"yellow circle dot"},{e:"🟠",t:"orange circle dot"},{e:"🔵",t:"blue circle dot"},{e:"🟣",t:"purple circle dot"},{e:"🟤",t:"brown circle dot"},{e:"⚪",t:"white circle dot"},{e:"⚫",t:"black circle dot"},{e:"🟩",t:"green square"},{e:"🟥",t:"red square"},{e:"🟨",t:"yellow square"},{e:"🟧",t:"orange square"},{e:"🟦",t:"blue square"},{e:"🟪",t:"purple square"},{e:"🟫",t:"brown square"},{e:"⬜",t:"white square"},{e:"⬛",t:"black square"},{e:"❤️",t:"heart red love"},{e:"💚",t:"heart green"},{e:"💙",t:"heart blue"},{e:"💜",t:"heart purple"},{e:"🧡",t:"heart orange"},{e:"💛",t:"heart yellow"},{e:"🤍",t:"heart white"},{e:"🏁",t:"flag checkered"},{e:"📫",t:"mailbox"},
  // Misc garden
  {e:"🥀",t:"wilted flower dead"},{e:"🪻",t:"lavender hyacinth"},{e:"🪷",t:"lotus waterlily"},{e:"🌰",t:"chestnut nut acorn"},{e:"🥚",t:"egg"},{e:"🫗",t:"water pouring"},{e:"🧊",t:"ice cube"},{e:"🍄",t:"mushroom fungus"},{e:"🐊",t:"crocodile alligator pond"},{e:"🦩",t:"flamingo bird pink"},{e:"🦢",t:"swan bird pond"},{e:"🪶",t:"feather bird"},{e:"🐝",t:"bee honeybee"},{e:"🍯",t:"honey pot bee"},
];
