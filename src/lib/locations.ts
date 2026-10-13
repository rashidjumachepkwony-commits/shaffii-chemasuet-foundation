export const countries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi", "South Sudan", "Ethiopia", "Other"];

export const countyData: Record<string, Record<string, Record<string, string[]>>> = {
  Mombasa: {
    Changamwe: {
      "Airport": ["Airport", "Changamwe Town", "Port Rehani"],
      "Bombululu": ["Bombululu", "Magogoni", "Kizingini"],
      "Changamwe Town": ["Changamwe Town", "Majengo", "Mnazi Mmoja"],
      "Kipevu": ["Kipevu", "Mombasa Port", "Majengo"],
      "Majengo": ["Majengo", "Port Rehani", "Changamwe"],
    },
    Jomvu: {
      "Jomvu": ["Jomvu Kuu", "Shangrila", "Mwalimu"],
      "Miritini": ["Miritini", "Kikambani", "Mwasongani"],
      "Kikambani": ["Kikambani", "Mwasongani", "Mikindani"],
    },
    Kisauni: {
      "Kisauni": ["Kisauni", "Kariokor", "Mji wa Huruma"],
      "Ruaraka": ["Ruaraka", "Mishra", "Kikuyu"],
      "Mtwapa": ["Mtwapa Kijiji", "Mikindani", "Msabitini"],
      "Kalimani": ["Kalimani", "Mkwajuni", "Mlimani"],
      "Mjimwema": ["Mjimwema", "Mvuvi", "Mkwajuni"],
    },
    Likoni: {
      "Likoni": ["Likoni", "Bofa", "Kipuyu"],
      "Uwanja wa Ngiri": ["Uwanja wa Ngiri", "Mikocheni", "Kichwa Kuu"],
    },
    Mvita: {
      "Mombasa Town West": ["Mombasa Town West", "Mnazi Mmoja", "Mlimani"],
      "Mombasa Town East": ["Mombasa Town East", "Miranzi", "Ndogan"],
    },
    Nyali: {
      "Nyali": ["Nyali", "Miran", "Kurawa"],
      "Kisauni": ["Kisauni", "Bombolulu", "Mvutani"],
      "Kongowea": ["Kongowea", "Mlolongo", "Mikindani"],
    },
  },
  Kwale: {
    Kinango: {
      "Kinango": ["Kinango", "Mwaheru", "Mkinga Mpembeni"],
      "Kasigau": ["Kasigau", "Mlimani", "Mwasora"],
      "Mpeklando": ["Mpeklando", "Mkwajuni", "Mlimani"],
      "Mkinga": ["Mkinga", "Mkinga Kuu", "Mwamba"],
    },
    Lungalunga: {
      "Lungalunga": ["Lungalunga", "Mwaele", "Mtaani"],
      "Kigoma": ["Kigoma", "Mkwajuni", "Mchangamano"],
      "Marere": ["Marere", "Mkwajuni", "Mlimani"],
    },
    Matuga: {
      "Matuga": ["Matuva", "Mavumvi", "Mshwenge"],
      "Kibunduru": ["Kibunduru", "Mkomazi", "Mlimani"],
      "Gazo": ["Gazo", "Mkwajuni", "Mlimani"],
    },
    Msambweni: {
      "Msambweni": ["Msambweni", "Makalani", "Mijangwani"],
      "Shumba": ["Shumba", "Mkwajuni", "Mkoroshoni"],
      "Puma": ["Puma", "Mkwajuni", "Mlimani"],
    },
  },
  Kilifi: {
    Ganze: {
      "Ganze": ["Ganze", "Mkwajuni", "Mshamba"],
      "Mwarumbu": ["Mwarumbu", "Chumvini", "Matiburi"],
      "Chakwa": ["Chakwa", "Kikunguni", "Ganze"],
      "Mkwatanu": ["Mkwatanu", "Ganze", "Mkwajuni"],
      "Bomere": ["Bomere", "Chumvini", "Mkwajuni"],
    },
    Kaloleni: {
      "Kaloleni": ["Kaloleni", "Maricau", "Mtondia"],
      "Ribe": ["Ribe", "Kikunguni", "Mlandizi"],
      "Karoni": ["Karoni", "Mshamba", "Mchangaruva"],
      "Marafa": ["Marafa", "Mkwajuni", "Mlimani"],
      "Mtondia": ["Mtondia", "Maricau", "Kaloleni"],
    },
    "Kilifi North": {
      "Malindi": ["Malindi", "Kakuyuni", "Mijakini"],
      "Kihoto": ["Kihoto", "Ganda", "Mkwajuni"],
      "Wumingu": ["Wumingu", "Malindi", "Mkwajuni"],
      "Kakuyuni": ["Kakuyuni", "Malindi", "Mijakini"],
    },
    "Kilifi South": {
      "Mombasa": ["Mombasa", "Maweni", "Junction"],
      "Ndavaya": ["Ndavaya", "Mkwajuni", "Mlimani"],
      "Shauri": ["Shauri", "Tudor", "Mkwajuni"],
      "Tiwi": ["Tiwi", "Mombasa", "Mkwajuni"],
    },
    Magarini: {
      "Magarini": ["Magarini", "Marafa", "Kikunguni"],
      "Sokoni": ["Sokoni", "Tudor", "Mkwajuni"],
      "Riwani": ["Riwani", "Marafa", "Kikunguni"],
      "Malindi": ["Malindi", "Marafa", "Kikunguni"],
    },
    Malindi: {
      "Malindi Town": ["Malindi Town", "Kakuyuni", "Mijakini"],
      "Malindi Rural": ["Malindi Rural", "Gandini", "Marafa"],
      "Malindi": ["Malindi", "Kakuyuni", "Mijakini"],
      "Mukurathi": ["Mukurathi", "Malindi", "Mkwajuni"],
    },
    Rabai: {
      "Rabai": ["Rabai", "Bombolulu", "Kikunguni"],
      "Kisauni": ["Kisauni", "Mkwajuni", "Mlimani"],
      "Bombolulu": ["Bombolulu", "Rabai", "Mkwajuni"],
      "Rabai Town": ["Rabai Town", "Rabai", "Mkwajuni"],
    },
  },
  "Tana River": {
    Bura: {
      "Bura": ["Bura", "Kipasini", "Mkwajuni"],
      "Kipasini": ["Kipasini", "Bura", "Mkwajuni"],
      "Mkwajuni": ["Bura", "Kipasini", "Mkwajuni"],
      "Wumingu": ["Wumingu", "Bura", "Mkwajuni"],
    },
    Galole: {
      "Galole": ["Galole", "Hulugho", "Ijara"],
      "Hulugho": ["Hulugho", "Mkwajuni", "Mlimani"],
      "Ijara": ["Ijara", "Mkwajuni", "Mlimani"],
      "Mikindani": ["Mikindani", "Kifaru", "Mlimani"],
      "Witu": ["Witu", "Galole", "Mkwajuni"],
    },
    Garsen: {
      "Garsen": ["Garsen", "Witu", "Mkwajuni"],
      "Witu": ["Witu", "Garsen", "Mkwajuni"],
      "Tharaka": ["Tharaka", "Garsen", "Mkwajuni"],
      "Chiakariga": ["Chiakariga", "Garsen", "Mkwajuni"],
    },
  },
  Lamu: {
    "Lamu East": {
      "Faza": ["Faza", "Pate", "Fumba"],
      "Pate": ["Pate", "Faza", "Shanga"],
      "Fumba": ["Fumba", "Faza", "Pate"],
      "Shanga": ["Shanga", "Pate", "Faza"],
    },
    "Lamu West": {
      "Lamu": ["Lamu", "Shela", "Mkokoteni"],
      "Mokowe": ["Mokowe", "Hiriwe", "Kizingini"],
      "Abae": ["Abae", "Lamu", "Mokowe"],
      "Witu": ["Witu", "Lamu", "Mokowe"],
    },
  },
  "Taita/Taveta": {
    Mwatate: {
      "Mwatate": ["Mwatate", "Mwarumonde", "Mbuguni"],
      "Voi": ["Voi", "Mkwajuni", "Mlimani"],
      "Mwarumonde": ["Mwarumonde", "Mwatate", "Mbuguni"],
    },
    Taveta: {
      "Taveta": ["Taveta", "Geduke", "Mkwajuni"],
      "Mitsuru": ["Mitsuru", "Mlimani", "Mkwajuni"],
    },
    Voi: {
      "Voi Town": ["Voi Town", "Mkwajuni", "Mlimani"],
    },
    Wundanyi: {
      "Wundanyi": ["Wundanyi", "Mkwajuni", "Mlimani"],
      "Mghonge": ["Mghonge", "Mkwajuni", "Mlimani"],
    },
  },
  Garissa: {
    Balambala: {
      "Balambala": ["Balambala", "Dadaab", "Mkwajuni"],
    },
    Dadaab: {
      "Dadaab": ["Dadaab", "Mlkoni", "Mkwajuni"],
      "Daar": ["Daar", "Mkwajuni", "Mlimani"],
    },
    Fafi: {
      "Fafi": ["Fafi", "Mkwajuni", "Mlimani"],
    },
    Garissa: {
      "Garissa Town": ["Garissa Town", "Mkwajuni", "Mlimani"],
      "Sanku": ["Sanku", "Mkwajuni", "Mlimani"],
    },
    Hulugho: {
      "Hulugho": ["Hulugho", "Mkwajuni", "Mlimani"],
    },
    Ijara: {
      "Ijara": ["Ijara", "Mkwajuni", "Mlimani"],
      "Masalani": ["Masalani", "Mkwajuni", "Mlimani"],
    },
    Lagdera: {
      "Lagdera": ["Lagdera", "Mkwajuni", "Mlimani"],
    },
  },
  Wajir: {
    Eldas: {
      "Eldas": ["Eldas", "Mkwajuni", "Mlimani"],
    },
    Habaswein: {
      "Habaswein": ["Habaswein", "Mkwajuni", "Mlimani"],
      "Suwa": ["Suwa", "Mkwajuni", "Mlimani"],
      "Bute": ["Bute", "Mkwajuni", "Mlimani"],
    },
    Tarbaj: {
      "Tarbaj": ["Tarbaj", "Mkwajuni", "Mlimani"],
      "Sala": ["Sala", "Mkwajuni", "Mlimani"],
      "Hadado": ["Hadado", "Mkwajuni", "Mlimani"],
    },
    "Wajir East": {
      "Wajir East": ["Wajir East", "Mkwajuni", "Mlimani"],
    },
    "Wajir North": {
      "Wajir North": ["Wajir North", "Mkwajuni", "Mlimani"],
      "Buna": ["Buna", "Mkwajuni", "Mlimani"],
      "Kone": ["Kone", "Mkwajuni", "Mlimani"],
    },
    "Wajir South": {
      "Wajir South": ["Wajir South", "Mkwajuni", "Mlimani"],
      "Difathu": ["Difathu", "Mkwajuni", "Mlimani"],
      "Sankale": ["Sankale", "Mkwajuni", "Mlimani"],
    },
    "Wajir West": {
      "Wajir West": ["Wajir West", "Mkwajuni", "Mlimani"],
      "Buna": ["Buna", "Mkwajuni", "Mlimani"],
      "Ragabu": ["Ragabu", "Mkwajuni", "Mlimani"],
    },
  },
  Mandera: {
    Banissa: {
      "Banissa": ["Banissa", "Mkwajuni", "Mlimani"],
      "Hatala": ["Hatala", "Mkwajuni", "Mlimani"],
      "Sokoni": ["Sokoni", "Mkwajuni", "Mlimani"],
    },
    Lafey: {
      "Lafey": ["Lafey", "Mkwajuni", "Mlimani"],
      "Arabia": ["Arabia", "Mkwajuni", "Mlimani"],
      "Kiliwehi": ["Kiliwehi", "Mkwajuni", "Mlimani"],
    },
    "Mandera East": {
      "Mandera East": ["Mandera East", "Mkwajuni", "Mlimani"],
      "Mandera": ["Mandera", "Mkwajuni", "Mlimani"],
    },
    "Mandera North": {
      "Mandera North": ["Mandera North", "Mkwajuni", "Mlimani"],
      "Khalalio": ["Khalalio", "Mkwajuni", "Mlimani"],
    },
    "Mandera South": {
      "Mandera South": ["Mandera South", "Mkwajuni", "Mlimani"],
    },
    "Mandera West": {
      "Mandera West": ["Mandera West", "Mkwajuni", "Mlimani"],
      "Wargagul": ["Wargagul", "Mkwajuni", "Mlimani"],
      "Rerna": ["Rerna", "Mkwajuni", "Mlimani"],
    },
  },
  Marsabit: {
    Laisamis: {
      "Laisamis": ["Laisamis", "Mkwajuni", "Mlimani"],
      "Wamba": ["Wamba", "Mkwajuni", "Mlimani"],
    },
    Moyale: {
      "Moyale": ["Moyale", "Mkwajuni", "Mlimani"],
      "Sololo": ["Sololo", "Mkwajuni", "Mlimani"],
    },
    "North Horr": {
      "North Horr": ["North Horr", "Mkwajuni", "Mlimani"],
    },
    Saku: {
      "Saku": ["Saku", "Mkwajuni", "Mlimani"],
      "Marsabit": ["Marsabit", "Mkwajuni", "Mlimani"],
    },
    Sololo: {
      "Sololo": ["Sololo", "Mkwajuni", "Mlimani"],
      "Moyale": ["Moyale", "Mkwajuni", "Mlimani"],
    },
  },
  Isiolo: {
    Isiolo: {
      "Isiolo": ["Isiolo", "Mkwajuni", "Mlimani"],
      "Garba": ["Garba", "Mkwajuni", "Mlimani"],
    },
    Merti: {
      "Merti": ["Merti", "Mkwajuni", "Mlimani"],
      "Bulesa": ["Bulesa", "Mkwajuni", "Mlimani"],
      "Wajir": ["Wajir", "Mkwajuni", "Mlimani"],
    },
    Garbatulla: {
      "Garbatulla": ["Garbatulla", "Mkwajuni", "Mlimani"],
      "Tulaga": ["Tulaga", "Mkwajuni", "Mlimani"],
    },
  },
  Meru: {
    Buuri: {
      "Buuri": ["Buuri", "Maua", "Mkwajuni"],
      "Maua": ["Maua", "Mkwajuni", "Mlimani"],
      "Nchogeta": ["Nchogeta", "Mkwajuni", "Mlimani"],
      "Antu": ["Antu", "Mkwajuni", "Mlimani"],
    },
    "Igembe Central": {
      "Igembe Central": ["Igembe Central", "Mkwajuni", "Mlimani"],
      "Malinguni": ["Malinguni", "Mkwajuni", "Mlimani"],
    },
    "Igembe North": {
      "Igembe North": ["Igembe North", "Mkwajuni", "Mlimani"],
    },
    "Igembe South": {
      "Igembe South": ["Igembe South", "Mkwajuni", "Mlimani"],
    },
    "Imenti North": {
      "Imenti North": ["Imenti North", "Mkwajuni", "Mlimani"],
      "Meru National Park": ["Meru National Park", "Mkwajuni", "Mlimani"],
    },
    "Imenti South": {
      "Imenti South": ["Imenti South", "Mkwajuni", "Mlimani"],
      "Malinguni": ["Malinguni", "Mkwajuni", "Mlimani"],
    },
    "Tigania Central": {
      "Tigania Central": ["Tigania Central", "Mkwajuni", "Mlimani"],
    },
    "Tigania East": {
      "Tigania East": ["Tigania East", "Mkwajuni", "Mlimani"],
    },
    "Tigania West": {
      "Tigania West": ["Tigania West", "Mkwajuni", "Mlimani"],
    },
  },
  "Tharaka-Nithi": {
    "Chuka/Igambang'ombe": {
      "Chuka": ["Chuka", "Mkwajuni", "Mlimani"],
      "Igambang'ombe": ["Igambang'ombe", "Mkwajuni", "Mlimani"],
    },
    Maara: {
      "Maara": ["Maara", "Mkwajuni", "Mlimani"],
      "Chuveche": ["Chuveche", "Mkwajuni", "Mlimani"],
    },
    Tharaka: {
      "Tharaka": ["Tharaka", "Mkwajuni", "Mlimani"],
    },
  },
  Embu: {
    Manyatta: {
      "Manyatta": ["Manyatta", "Mkwajuni", "Mlimani"],
      "Runyenjes": ["Runyenjes", "Mkwajuni", "Mlimani"],
    },
    "Mbeere North": {
      "Mbeere North": ["Mbeere North", "Mkwajuni", "Mlimani"],
      "Siakago": ["Siakago", "Mkwajuni", "Mlimani"],
    },
    "Mbeere South": {
      "Mbeere South": ["Mbeere South", "Mkwajuni", "Mlimani"],
      "Igoji": ["Igoji", "Mkwajuni", "Mlimani"],
    },
    Runyenjes: {
      "Runyenjes": ["Runyenjes", "Mkwajuni", "Mlimani"],
      "Manyatta": ["Manyatta", "Mkwajuni", "Mlimani"],
    },
  },
  Kitui: {
    "Kitui Central": {
      "Kitui Central": ["Kitui Central", "Kangundo", "Mkwajuni"],
      "Kangundo": ["Kangundo", "Mkwajuni", "Mlimani"],
    },
    "Kitui East": {
      "Kitui East": ["Kitui East", "Mkwajuni", "Mlimani"],
    },
    "Kitui Rural": {
      "Kitui Rural": ["Kitui Rural", "Mkwajuni", "Mlimani"],
    },
    "Kitui South": {
      "Kitui South": ["Kitui South", "Mkwajuni", "Mlimani"],
    },
    "Kitui West": {
      "Kitui West": ["Kitui West", "Mkwajuni", "Mlimani"],
    },
    "Mwingi Central": {
      "Mwingi Central": ["Mwingi Central", "Mwingi", "Mkwajuni"],
      "Mwingi": ["Mwingi", "Mkwajuni", "Mlimani"],
    },
    "Mwingi North": {
      "Mwingi North": ["Mwingi North", "Mkwajuni", "Mlimani"],
    },
    "Mwingi West": {
      "Mwingi West": ["Mwingi West", "Mkwajuni", "Mlimani"],
    },
  },
  Machakos: {
    "Athi River": {
      "Athi River": ["Athi River", "Mlolongo", "Mkwajuni"],
      "Mlolongo": ["Mlolongo", "Mkwajuni", "Mlimani"],
    },
    Kangundo: {
      "Kangundo": ["Kangundo", "Meli", "Mkwajuni"],
      "Meli": ["Meli", "Mkwajuni", "Mlimani"],
    },
    Kathiani: {
      "Kathiani": ["Kathiani", "Mkwajuni", "Mlimani"],
    },
    "Machakos Town": {
      "Machakos Town": ["Machakos Town", "Mukuyu", "Mkwajuni"],
      "Mukuyu": ["Mukuyu", "Mkwajuni", "Mlimani"],
    },
    Masinga: {
      "Masinga": ["Masinga", "Mukurain", "Mkwajuni"],
    },
    Matungulu: {
      "Matungulu": ["Matungulu", "Kavunani", "Mkwajuni"],
    },
    Mavoko: {
      "Mavoko": ["Mavoko", "Athi River", "Mkwajuni"],
      "Athi River": ["Athi River", "Mkwajuni", "Mlimani"],
    },
    Mwala: {
      "Mwala": ["Mwala", "Kikumba", "Mkwajuni"],
    },
    Yatta: {
      "Yatta": ["Yatta", "Mkwajuni", "Mlimani"],
    },
  },
  Makueni: {
    Kaiti: {
      "Kaiti": ["Kaiti", "Kilome", "Mkwajuni"],
      "Kilome": ["Kilome", "Mkwajuni", "Mlimani"],
    },
    "Kibwezi East": {
      "Kibwezi East": ["Kibwezi East", "Mkwajuni", "Mlimani"],
    },
    "Kibwezi West": {
      "Kibwezi West": ["Kibwezi West", "Mkwajuni", "Mlimani"],
    },
    Kilome: {
      "Kilome": ["Kilome", "Mkwajuni", "Mlimani"],
    },
    Makueni: {
      "Makueni": ["Makueni", "Mkwajuni", "Mlimani"],
    },
    Mbooni: {
      "Mbooni": ["Mbooni", "Mbolai", "Mkwajuni"],
      "Mbolai": ["Mbolai", "Mkwajuni", "Mlimani"],
    },
    Mukaa: {
      "Mukaa": ["Mukaa", "Mbinguni", "Mkwajuni"],
      "Mbinguni": ["Mbinguni", "Mkwajuni", "Mlimani"],
    },
    Nzaui: {
      "Nzaui": ["Nzaui", "Mkwajuni", "Mlimani"],
    },
  },
  Nyandarua: {
    Kinangop: {
      "Kinangop": ["Kinangop", "Mkwajuni", "Mlimani"],
    },
    Kipipiri: {
      "Kipipiri": ["Kipipiri", "Mkwajuni", "Mlimani"],
    },
    Ndaragwa: {
      "Ndaragwa": ["Ndaragwa", "Mkwajuni", "Mlimani"],
    },
    "Ol Kalou": {
      "Ol Kalou": ["Ol Kalou", "Mkwajuni", "Mlimani"],
    },
    "Ol Joro Orok": {
      "Ol Joro Orok": ["Ol Joro Orok", "Mkwajuni", "Mlimani"],
    },
  },
  Nyeri: {
    Kieni: {
      "Kieni": ["Kieni", "Nyeri", "Mkwajuni"],
      "Nyeri": ["Nyeri", "Mkwajuni", "Mlimani"],
    },
    "Kieni East": {
      "Kieni East": ["Kieni East", "Mkwajuni", "Mlimani"],
    },
    Mathira: {
      "Mathira": ["Mathira", "Kahatia", "Mkwajuni"],
      "Kahatia": ["Kahatia", "Mkwajuni", "Mlimani"],
    },
    Mukurweini: {
      "Mukurweini": ["Mukurweini", "Kinyuji", "Mkwajuni"],
      "Kinyuji": ["Kinyuji", "Mkwajuni", "Mlimani"],
    },
    "Nyeri Town": {
      "Nyeri Town": ["Nyeri Town", "Mkwajuni", "Mlimani"],
    },
    Othaya: {
      "Othaya": ["Othaya", "Mkwajuni", "Mlimani"],
    },
    Tetu: {
      "Tetu": ["Tetu", "Mkwajuni", "Mlimani"],
    },
  },
  Kirinyaga: {
    Gichugu: {
      "Gichugu": ["Gichugu", "Kutus", "Mkwajuni"],
      "Kutus": ["Kutus", "Mkwajuni", "Mlimani"],
    },
    "Kirinyaga Central": {
      "Kirinyaga Central": ["Kirinyaga Central", "Mkwajuni", "Mlimani"],
    },
    "Kirinyaga East": {
      "Kirinyaga East": ["Kirinyaga East", "Mkwajuni", "Mlimani"],
    },
    "Kirinyaga West": {
      "Kirinyaga West": ["Kirinyaga West", "Mkwajuni", "Mlimani"],
    },
    Mwea: {
      "Mwea": ["Mwea", "Tebu", "Mkwajuni"],
      "Tebu": ["Tebu", "Mkwajuni", "Mlimani"],
    },
  },
  "Murang'a": {
    Gatanga: {
      "Gatanga": ["Gatanga", "Kinyua", "Mkwajuni"],
      "Kinyua": ["Kinyua", "Mkwajuni", "Mlimani"],
    },
    Kandara: {
      "Kandara": ["Kandara", "Sagana", "Mkwajuni"],
      "Sagana": ["Sagana", "Mkwajuni", "Mlimani"],
    },
    Kangema: {
      "Kangema": ["Kangema", "Mkwajuni", "Mlimani"],
    },
    Kigumo: {
      "Kigumo": ["Kigumo", "Tulagi", "Mkwajuni"],
      "Tulagi": ["Tulagi", "Mkwajuni", "Mlimani"],
    },
    Kiharu: {
      "Kiharu": ["Kiharu", "Mukuyu", "Mkwajuni"],
      "Mukuyu": ["Mukuyu", "Mkwajuni", "Mlimani"],
    },
    Maragua: {
      "Maragua": ["Maragua", "Madiba", "Mkwajuni"],
      "Madiba": ["Madiba", "Mkwajuni", "Mlimani"],
    },
    Mathioya: {
      "Mathioya": ["Mathioya", "Mkwajuni", "Mlimani"],
    },
  },
  Kiambu: {
    "Gatundu North": {
      "Gatundu North": ["Gatundu North", "Kiganjo", "Mkwajuni"],
    },
    "Gatundu South": {
      "Gatundu South": ["Gatundu South", "Mkwajuni", "Mlimani"],
    },
    Githunguri: {
      "Githunguri": ["Githunguri", "Mukuyu", "Mkwajuni"],
    },
    Juja: {
      "Juja": ["Juja", "Thika", "Mkwajuni"],
      "Thika": ["Thika", "Mkwajuni", "Mlimani"],
    },
    Kabete: {
      "Kabete": ["Kabete", "Mkwajuni", "Mlimani"],
    },
    Kiambaa: {
      "Kiambaa": ["Kiambaa", "Mkwajuni", "Mlimani"],
    },
    "Kiambu Town": {
      "Kiambu Town": ["Kiambu Town", "Mkwajuni", "Mlimani"],
    },
    Kikuyu: {
      "Kikuyu": ["Kikuyu", "Gikambura", "Mkwajuni"],
      "Gikambura": ["Gikambura", "Mkwajuni", "Mlimani"],
    },
    Lari: {
      "Lari": ["Lari", "Kinale", "Mkwajuni"],
      "Kinale": ["Kinale", "Mkwajuni", "Mlimani"],
    },
    Limuru: {
      "Limuru": ["Limuru", "Ndareru", "Mkwajuni"],
      "Ndareru": ["Ndareru", "Mkwajuni", "Mlimani"],
    },
    Ruiru: {
      "Ruiru": ["Ruiru", "Mwiki", "Mkwajuni"],
      "Mwiki": ["Mwiki", "Mkwajuni", "Mlimani"],
    },
    "Thika Town": {
      "Thika Town": ["Thika Town", "Mkwajuni", "Mlimani"],
    },
  },
  Turkana: {
    Kibish: {
      "Kibish": ["Kibish", "Orpa", "Mkwajuni"],
      "Orpa": ["Orpa", "Mkwajuni", "Mlimani"],
    },
    Loima: {
      "Loima": ["Loima", "Mkwajuni", "Mlimani"],
    },
    "Turkana Central": {
      "Turkana Central": ["Turkana Central", "Lokichanna", "Mkwajuni"],
      "Lokichanna": ["Lokichanna", "Mkwajuni", "Mlimani"],
    },
    "Turkana East": {
      "Turkana East": ["Turkana East", "Mkwajuni", "Mlimani"],
    },
    "Turkana North": {
      "Turkana North": ["Turkana North", "Mkwajuni", "Mlimani"],
    },
    "Turkana South": {
      "Turkana South": ["Turkana South", "Mkwajuni", "Mlimani"],
    },
  },
  "West Pokot": {
    Kacheliba: {
      "Kacheliba": ["Kacheliba", "Kasei", "Mkwajuni"],
      "Kasei": ["Kasei", "Mkwajuni", "Mlimani"],
    },
    Kapenguria: {
      "Kapenguria": ["Kapenguria", "Tuliyapak", "Mkwajuni"],
      "Tuliyapak": ["Tuliyapak", "Mkwajuni", "Mlimani"],
    },
    "Pokot South": {
      "Pokot South": ["Pokot South", "Biyoon", "Mkwajuni"],
      "Biyoon": ["Biyoon", "Mkwajuni", "Mlimani"],
    },
    Sigor: {
      "Sigor": ["Sigor", "Kipkelion", "Mkwajuni"],
      "Kipkelion": ["Kipkelion", "Mkwajuni", "Mlimani"],
    },
    "West Pokot": {
      "West Pokot": ["West Pokot", "Kapenguria", "Mkwajuni"],
    },
  },
  Samburu: {
    "Samburu East": {
      "Samburu East": ["Samburu East", "Wamba", "Mkwajuni"],
      "Wamba": ["Wamba", "Mkwajuni", "Mlimani"],
    },
    "Samburu North": {
      "Samburu North": ["Samburu North", "Lokich", "Mkwajuni"],
      "Lokich": ["Lokich", "Mkwajuni", "Mlimani"],
    },
    "Samburu West": {
      "Samburu West": ["Samburu West", "Maralal", "Mkwajuni"],
      "Maralal": ["Maralal", "Mkwajuni", "Mlimani"],
    },
  },
  "Trans Nzoia": {
    Cherangany: {
      "Cherangany": ["Cherangany", "Kapteng", "Mkwajuni"],
      "Kapteng": ["Kapteng", "Mkwajuni", "Mlimani"],
    },
    Endebess: {
      "Endebess": ["Endebess", "Sikhendu", "Mkwajuni"],
      "Sikhendu": ["Sikhendu", "Mkwajuni", "Mlimani"],
    },
    Kwanza: {
      "Kwanza": ["Kwanza", "Mkwajuni", "Mlimani"],
    },
    Saboti: {
      "Saboti": ["Saboti", "Tula", "Mkwajuni"],
      "Tula": ["Tula", "Mkwajuni", "Mlimani"],
    },
    Kiminini: {
      "Kiminini": ["Kiminini", "Cheptuyek", "Mkwajuni"],
      "Cheptuyek": ["Cheptuyek", "Mkwajuni", "Mlimani"],
    },
    "Trans Nzoia East": {
      "Trans Nzoia East": ["Trans Nzoia East", "Mkwajuni", "Mlimani"],
    },
    "Trans Nzoia West": {
      "Trans Nzoia West": ["Trans Nzoia West", "Mkwajuni", "Mlimani"],
    },
  },
  "Uasin Gishu": {
    Ainabkoi: {
      "Ainabkoi": ["Ainabkoi", "Kapilkilmat", "Mkwajuni"],
    },
    Kapseret: {
      "Kapseret": ["Kapseret", "Kapsabet", "Mkwajuni"],
      "Kapsabet": ["Kapsabet", "Mkwajuni", "Mlimani"],
    },
    Kesses: {
      "Kesses": ["Kesses", "Kapsabet", "Mkwajuni"],
    },
    Moiben: {
      "Moiben": ["Moiben", "Cheptelu", "Mkwajuni"],
      "Cheptelu": ["Cheptelu", "Mkwajuni", "Mlimani"],
    },
    Soy: {
      "Soy": ["Soy", "Kaptagaga", "Mkwajuni"],
      "Kaptagaga": ["Kaptagaga", "Mkwajuni", "Mlimani"],
    },
    Turbo: {
      "Turbo": ["Turbo", "Mkwajuni", "Mlimani"],
    },
  },
  "Elgeyo-Marakwet": {
    "Keiyo North": {
      "Keiyo North": ["Keiyo North", "Mkwajuni", "Mlimani"],
    },
    "Keiyo South": {
      "Keiyo South": ["Keiyo South", "Mkwajuni", "Mlimani"],
    },
    "Marakwet East": {
      "Marakwet East": ["Marakwet East", "Kapsaram", "Mkwajuni"],
      "Kapsaram": ["Kapsaram", "Mkwajuni", "Mlimani"],
    },
    "Marakwet West": {
      "Marakwet West": ["Marakwet West", "Tenges", "Mkwajuni"],
      "Tenges": ["Tenges", "Mkwajuni", "Mlimani"],
    },
  },
  Nandi: {
    Aldai: {
      "Aldai": ["Aldai", "Soba", "Mkwajuni"],
      "Soba": ["Soba", "Mkwajuni", "Mlimani"],
    },
    Chesumei: {
      "Chesumei": ["Chesumei", "Mkwajuni", "Mlimani"],
    },
    Emgwen: {
      "Emgwen": ["Emgwen", "Kapsabet", "Mkwajuni"],
    },
    Mosop: {
      "Mosop": ["Mosop", "Mkwajuni", "Mlimani"],
    },
    "Nandi Hills": {
      "Nandi Hills": ["Nandi Hills", "Mkwajuni", "Mlimani"],
    },
    Tinderet: {
      "Tinderet": ["Tinderet", "Mkwajuni", "Mlimani"],
    },
  },
  Baringo: {
    "Baringo Central": {
      "Baringo Central": ["Baringo Central", "Mogot", "Mkwajuni"],
      "Mogot": ["Mogot", "Mkwajuni", "Mlimani"],
    },
    "Baringo North": {
      "Baringo North": ["Baringo North", "Mkwajuni", "Mlimani"],
    },
    "Baringo South": {
      "Baringo South": ["Baringo South", "Mkwajuni", "Mlimani"],
    },
    "Eldama Ravine": {
      "Eldama Ravine": ["Eldama Ravine", "Maralal", "Mkwajuni"],
    },
    Mogotio: {
      "Mogotio": ["Mogotio", "Kipsaram", "Mkwajuni"],
      "Kipsaram": ["Kipsaram", "Mkwajuni", "Mlimani"],
    },
    Tiaty: {
      "Tiaty": ["Tiaty", "Mkwajuni", "Mlimani"],
    },
  },
  Laikipia: {
    "Laikipia Central": {
      "Laikipia Central": ["Laikipia Central", "Nanyuki", "Mkwajuni"],
      "Nanyuki": ["Nanyuki", "Mkwajuni", "Mlimani"],
    },
    "Laikipia East": {
      "Laikipia East": ["Laikipia East", "Mkwajuni", "Mlimani"],
    },
    "Laikipia North": {
      "Laikipia North": ["Laikipia North", "Mkwajuni", "Mlimani"],
    },
    "Laikipia West": {
      "Laikipia West": ["Laikipia West", "Mkwajuni", "Mlimani"],
    },
  },
  Nakuru: {
    Bahati: {
      "Bahati": ["Bahati", "Lanet", "Mkwajuni"],
      "Lanet": ["Lanet", "Mkwajuni", "Mlimani"],
    },
    Gilgil: {
      "Gilgil": ["Gilgil", "Malewa", "Mkwajuni"],
      "Malewa": ["Malewa", "Mkwajuni", "Mlimani"],
    },
    "Kuresoi North": {
      "Kuresoi North": ["Kuresoi North", "Mkwajuni", "Mlimani"],
    },
    "Kuresoi South": {
      "Kuresoi South": ["Kuresoi South", "Mkwajuni", "Mlimani"],
    },
    Molo: {
      "Molo": ["Molo", "Elburgon", "Mkwajuni"],
      "Elburgon": ["Elburgon", "Mkwajuni", "Mlimani"],
    },
    Naivasha: {
      "Naivasha": ["Naivasha", "Mai Mahiu", "Mkwajuni"],
      "Mai Mahiu": ["Mai Mahiu", "Mkwajuni", "Mlimani"],
    },
    "Nakuru East": {
      "Nakuru East": ["Nakuru East", "Mkwajuni", "Mlimani"],
    },
    "Nakuru West": {
      "Nakuru West": ["Nakuru West", "Mkwajuni", "Mlimani"],
    },
    Njoro: {
      "Njoro": ["Njoro", "Kapthuku", "Mkwajuni"],
      "Kapthuku": ["Kapthuku", "Mkwajuni", "Mlimani"],
    },
    Rongai: {
      "Rongai": ["Rongai", "Mkwajuni", "Mlimani"],
    },
    Subukia: {
      "Subukia": ["Subukia", "Mkwajuni", "Mlimani"],
    },
  },
  Narok: {
    "Emurua Dikirr": {
      "Emurua Dikirr": ["Emurua Dikirr", "Mkwajuni", "Mlimani"],
    },
    Kilgoris: {
      "Kilgoris": ["Kilgoris", "Lolshogian", "Mkwajuni"],
      "Lolshogian": ["Lolshogian", "Mkwajuni", "Mlimani"],
    },
    "Narok East": {
      "Narok East": ["Narok East", "Mkwajuni", "Mlimani"],
    },
    "Narok North": {
      "Narok North": ["Narok North", "Osupek", "Mkwajuni"],
      "Osupek": ["Osupek", "Mkwajuni", "Mlimani"],
    },
    "Narok South": {
      "Narok South": ["Narok South", "Esok", "Mkwajuni"],
      "Esok": ["Esok", "Mkwajuni", "Mlimani"],
    },
    "Narok West": {
      "Narok West": ["Narok West", "Mkwajuni", "Mlimani"],
    },
  },
  Kajiado: {
    Isinya: {
      "Isinya": ["Isinya", "Kitengela", "Mkwajuni"],
      "Kitengela": ["Kitengela", "Mkwajuni", "Mlimani"],
    },
    "Kajiado Central": {
      "Kajiado Central": ["Kajiado Central", "Kajiado", "Mkwajuni"],
      "Kajiado": ["Kajiado", "Mkwajuni", "Mlimani"],
    },
    "Kajiado East": {
      "Kajiado East": ["Kajiado East", "Mkwajuni", "Mlimani"],
    },
    "Kajiado North": {
      "Kajiado North": ["Kajiado North", "Mkwajuni", "Mlimani"],
    },
    "Kajiado South": {
      "Kajiado South": ["Kajiado South", "Mkwajuni", "Mlimani"],
    },
    "Kajiado West": {
      "Kajiado West": ["Kajiado West", "Mkwajuni", "Mlimani"],
    },
    Loitokitok: {
      "Loitokitok": ["Loitokitok", "Rongai", "Mkwajuni"],
    },
    Mashuuru: {
      "Mashuuru": ["Mashuuru", "Mkwajuni", "Mlimani"],
    },
  },
  Kericho: {
    Ainamoi: {
      "Ainamoi": ["Ainamoi", "Cheptiret", "Mkwajuni"],
      "Cheptiret": ["Cheptiret", "Mkwajuni", "Mlimani"],
    },
    Belgut: {
      "Belgut": ["Belgut", "Mkwajuni", "Mlimani"],
    },
    Bureti: {
      "Bureti": ["Bureti", "Londiani", "Mkwajuni"],
      "Londiani": ["Londiani", "Mkwajuni", "Mlimani"],
    },
    "Kipkelion East": {
      "Kipkelion East": ["Kipkelion East", "Kipkelion", "Mkwajuni"],
      "Kipkelion": ["Kipkelion", "Mkwajuni", "Mlimani"],
    },
    "Kipkelion West": {
      "Kipkelion West": ["Kipkelion West", "Mkwajuni", "Mlimani"],
    },
    Sigowet: {
      "Sigowet": ["Sigowet", "Kapsabet", "Mkwajuni"],
    },
  },
  Bomet: {
    "Bomet Central": {
      "Bomet Central": ["Bomet Central", "Bomet", "Mkwajuni"],
    },
    "Bomet East": {
      "Bomet East": ["Bomet East", "Kembu", "Mkwajuni"],
      "Kembu": ["Kembu", "Mkwajuni", "Mlimani"],
    },
    Chepalungu: {
      "Chepalungu": ["Chepalungu", "Mkwajuni", "Mlimani"],
    },
    Konoin: {
      "Konoin": ["Konoin", "Leboo", "Mkwajuni"],
      "Leboo": ["Leboo", "Mkwajuni", "Mlimani"],
    },
    Sotik: {
      "Sotik": ["Sotik", "Kaplumbety", "Mkwajuni"],
      "Kaplumbety": ["Kaplumbety", "Mkwajuni", "Mlimani"],
    },
  },
  Kakamega: {
    Butere: {
      "Butere": ["Butere", "Khwale", "Mkwajuni"],
    },
    Khwisero: {
      "Khwisero": ["Khwisero", "Mkwajuni", "Mlimani"],
    },
    Likuyani: {
      "Likuyani": ["Likuyani", "Mkwajuni", "Mlimani"],
    },
    Lugari: {
      "Lugari": ["Lugari", "Chepchugui", "Mkwajuni"],
      "Chepchugui": ["Chepchugui", "Mkwajuni", "Mlimani"],
    },
    Malava: {
      "Malava": ["Malava", "Mkwajuni", "Mlimani"],
    },
    "Mumias East": {
      "Mumias East": ["Mumias East", "Mumias", "Mkwajuni"],
      "Mumias": ["Mumias", "Mkwajuni", "Mlimani"],
    },
    "Mumias West": {
      "Mumias West": ["Mumias West", "Shinyalu", "Mkwajuni"],
      "Shinyalu": ["Shinyalu", "Mkwajuni", "Mlimani"],
    },
    Navakholo: {
      "Navakholo": ["Navakholo", "Kakamega", "Mkwajuni"],
    },
    Lurambi: {
      "Lurambi": ["Lurambi", "Mkwajuni", "Mlimani"],
    },
    Ikolomani: {
      "Ikolomani": ["Ikolomani", "Kisumu", "Mkwajuni"],
    },
    Matungu: {
      "Matungu": ["Matungu", "Kakoneni", "Mkwajuni"],
      "Kakoneni": ["Kakoneni", "Mkwajuni", "Mlimani"],
    },
    Shinyalu: {
      "Shinyalu": ["Shinyalu", "Mkwajuni", "Mlimani"],
    },
  },
  Vihiga: {
    Emuhaya: {
      "Emuhaya": ["Emuhaya", "Vihiga", "Mkwajuni"],
    },
    Hamisi: {
      "Hamisi": ["Hamisi", "Mkwajuni", "Mlimani"],
    },
    Luanda: {
      "Luanda": ["Luanda", "Mbale", "Mkwajuni"],
      "Mbale": ["Mbale", "Mkwajuni", "Mlimani"],
    },
    Sabatia: {
      "Sabatia": ["Sabatia", "Mkwajuni", "Mlimani"],
    },
    Vihiga: {
      "Vihiga": ["Vihiga", "Maji", "Mkwajuni"],
      "Maji": ["Maji", "Mkwajuni", "Mlimani"],
    },
  },
  Bungoma: {
    Bumula: {
      "Kabula": ["Kabula"],
      "Kimaeti": ["Kimaeti"],
      "Siboti": ["Siboti"],
      "South Bukusu": ["South Bukusu"],
      "Bumula": ["Bumula"],
      "Khasoko": ["Khasoko"],
      "West Bukusu": ["West Bukusu"],
    },
    Kabuchai: {
      "West Nalondo": ["West Nalondo"],
      "Mukuyuni": ["Mukuyuni"],
      "Kabuchai/Chwele": ["Kabuchai/Chwele"],
      "Bwake/Luuya": ["Bwake/Luuya"],
    },
    Kanduyi: {
      "Bukembe West": ["Bukembe West"],
      "Bukembe East": ["Bukembe East"],
      "Township": ["Township"],
      "Khalaba": ["Khalaba"],
      "Musikoma": ["Musikoma"],
      "East Sang'alo": ["East Sang'alo"],
      "Tuuti/Marakaru": ["Tuuti/Marakaru"],
      "West Sang'alo": ["West Sang'alo"],
    },
    Kimilili: {
      "Kibingei": ["Kibingei"],
      "Kimilili": ["Kimilili"],
      "Maeni": ["Maeni"],
      "Kamukuywa": ["Kamukuywa"],
    },
    "Mt Elgon": {
      "Cheptais": ["Cheptais"],
      "Kakateny": ["Kakateny"],
      "Kaptama": ["Kaptama"],
      "Chesikaki": ["Chesikaki"],
      "Chepyuk": ["Chepyuk"],
      "Elgon": ["Elgon"],
    },
    Sirisia: {
      "Malakisi/South Kulisiru": ["Malakisi/South Kulisiru"],
      "Lwandanyi": ["Lwandanyi"],
      "Namwela": ["Namwela"],
    },
    Tongaren: {
      "Mbakalo": ["Mbakalo"],
      "Naitiri/Kabuyefwe": ["Naitiri/Kabuyefwe"],
      "Milima": ["Milima"],
      "Ndalu/Tabani": ["Ndalu/Tabani"],
      "Tongaren": ["Tongaren"],
      "Soysambu/Mitua": ["Soysambu/Mitua"],
    },
    "Webuye East": {
      "Mihuu": ["Mihuu"],
      "Ndivisi": ["Ndivisi"],
      "Maraka": ["Maraka"],
    },
    "Webuye West": {
      "Bokoli": ["Bokoli"],
      "Misikhu": ["Misikhu"],
      "Sitikho": ["Sitikho"],
      "Matulo": ["Matulo"],
    },
  },
  Busia: {
    Budalangi: {
      "Bunyala Central": ["Bunyala Central"],
      "Bunyala North": ["Bunyala North"],
      "Bunyala West": ["Bunyala West"],
      "Bunyala South": ["Bunyala South"],
    },
    Butula: {
      "Marachi West": ["Marachi West"],
      "Marachi East": ["Marachi East"],
      "Marachi North": ["Marachi North"],
      "Elugulu": ["Elugulu"],
      "Kingandole": ["Kingandole"],
      "Marachi Central": ["Marachi Central"],
    },
    Funyula: {
      "Namboboto-Nambuku": ["Namboboto-Nambuku"],
      "Nangina": ["Nangina"],
      "Ageng'a Nanguba": ["Ageng'a Nanguba"],
      "Bwiri": ["Bwiri"],
    },
    Matayos: {
      "Bukhayo West": ["Bukhayo West"],
      "Mayenje": ["Mayenje"],
      "Matayos South": ["Matayos South"],
      "Busibwabo": ["Busibwabo"],
      "Burumba": ["Burumba"],
    },
    Nambale: {
      "Nambale Township": ["Nambale Township"],
      "Bukhayo North/Walatsi": ["Bukhayo North/Walatsi"],
      "Bukhayo East": ["Bukhayo East"],
      "Bukhayo Central": ["Bukhayo Central"],
    },
    "Teso North": {
      "Malaba Central": ["Malaba Central"],
      "Malaba North": ["Malaba North"],
      "Ang'urai South": ["Ang'urai South"],
      "Ang'urai North": ["Ang'urai North"],
      "Ang'urai East": ["Ang'urai Location", "Ang'urai Township", "Changara Location", "Kolanya", "Chemasiri", "Oshoromo", "Kakemer", "Kopia", "Akobwait", "Aloete", "Kawalun", "Ataba Oburi", "Angaro", "Kisiombe", "Matumbai", "Akadot"],
      "Malaba South": ["Malaba South"],
    },
    "Teso South": {
      "Ang'orom": ["Ang'orom"],
      "Chakol South": ["Chakol South"],
      "Chakol North": ["Chakol North"],
      "Amukura West": ["Amukura West"],
      "Amukura East": ["Amukura East"],
      "Amukura Central": ["Amukura Central"],
    },
  },
  Siaya: {
    "Alego Usonga": {
      "Alego Usonga": ["Alego Usonga", "Ukwala", "Mkwajuni"],
      "Ukwala": ["Ukwala", "Mkwajuni", "Mlimani"],
    },
    Bondo: {
      "Bondo": ["Bondo", "Sokoni", "Mkwajuni"],
      "Sokoni": ["Sokoni", "Mkwajuni", "Mlimani"],
    },
    Gem: {
      "Gem": ["Gem", "Wundo", "Mkwajuni"],
      "Wundo": ["Wundo", "Mkwajuni", "Mlimani"],
    },
    Rarieda: {
      "Rarieda": ["Rarieda", "Muhoroni", "Mkwajuni"],
    },
    Ugenya: {
      "Ugenya": ["Ugenya", "Uyuu", "Mkwajuni"],
      "Uyuu": ["Uyuu", "Mkwajuni", "Mlimani"],
    },
    Ugunja: {
           "Ugunja": ["Ugunja", "Mkwajuni", "Mlimani"],
    },
    "Siaya Town": {
      "Siaya Town": ["Siaya Town", "Mkwajuni", "Mlimani"],
      "Ukwala": ["Ukwala", "Mkwajuni", "Mlimani"],
    },
  },
  Kisumu: {
    "Kisumu Central": {
      "Kisumu Central": ["Kisumu Central", "Mkwajuni", "Mlimani"],
    },
    "Kisumu East": {
      "Kisumu East": ["Kisumu East", "Mkwajuni", "Mlimani"],
    },
    "Kisumu West": {
      "Kisumu West": ["Kisumu West", "Mkwajuni", "Mlimani"],
    },
    Muhoroni: {
      "Muhoroni": ["Muhoroni", "Kibos", "Mkwajuni"],
    },
    Nyakach: {
      "Nyakach": ["Nyakach", "Mkwajuni", "Mlimani"],
    },
    Nyando: {
      "Nyando": ["Nyando", "Kisumu", "Mkwajuni"],
    },
    Seme: {
      "Seme": ["Seme", "Mkwajuni", "Mlimani"],
    },
  },
  "Homa Bay": {
    "Homabay Town": {
      "Homabay Town": ["Homabay Town", "Mkwajuni", "Mlimani"],
    },
    Karachuonyo: {
      "Karachuonyo": ["Karachuonyo", "Mkwajuni", "Mlimani"],
    },
    "Kasipul": {
      "Kasipul": ["Kasipul", "Mkwajuni", "Mlimani"],
    },
    "Kabondo Kasipul": {
      "Kabondo Kasipul": ["Kabondo Kasipul", "Mkwajuni", "Mlimani"],
    },
    Ndhiwa: {
      "Ndhiwa": ["Ndhiwa", "Mkwajuni", "Mlimani"],
    },
    Rangwe: {
      "Rangwe": ["Rangwe", "Mkwajuni", "Mlimani"],
    },
    "Suba North": {
      "Suba North": ["Suba North", "Mkwajuni", "Mlimani"],
    },
    "Suba South": {
      "Suba South": ["Suba South", "Mkwajuni", "Mlimani"],
    },
    Gwassi: {
      "Gwassi": ["Gwassi", "Mkwajuni", "Mlimani"],
    },
  },
  Migori: {
    Awendo: {
      "Awendo": ["Awendo", "Sare", "Mkwajuni"],
      "Sare": ["Sare", "Mkwajuni", "Mlimani"],
    },
    "Kuria East": {
      "Kuria East": ["Kuria East", "Mkwajuni", "Mlimani"],
    },
    "Kuria West": {
      "Kuria West": ["Kuria West", "Mkwajuni", "Mlimani"],
    },
    Mabera: {
      "Mabera": ["Mabera", "Mkwajuni", "Mlimani"],
    },
    Nyatike: {
      "Nyatike": ["Nyatike", "Muhoroni", "Mkwajuni"],
      "Muhoroni": ["Muhoroni", "Mkwajuni", "Mlimani"],
    },
    Rongo: {
      "Rongo": ["Rongo", "Mkwajuni", "Mlimani"],
    },
    "Suna East": {
      "Suna East": ["Suna East", "Mkwajuni", "Mlimani"],
    },
    "Suna West": {
      "Suna West": ["Suna West", "Mkwajuni", "Mlimani"],
    },
    Uriri: {
      "Uriri": ["Uriri", "Mkwajuni", "Mlimani"],
    },
  },
  Kisii: {
    Bobasi: {
      "Bobasi": ["Bobasi", "Masimbi", "Mkwajuni"],
      "Masimbi": ["Masimbi", "Mkwajuni", "Mlimani"],
    },
    "Bomachoge Borabu": {
      "Bomachoge Borabu": ["Bomachoge Borabu", "Borabu", "Mkwajuni"],
      "Borabu": ["Borabu", "Mkwajuni", "Mlimani"],
    },
    "Bomachoge Chache": {
      "Bomachoge Chache": ["Bomachoge Chache", "Mkwajuni", "Mlimani"],
    },
    Bonchari: {
      "Bonchari": ["Bonchari", "Mkwajuni", "Mlimani"],
    },
    "Kitutu Chache North": {
      "Kitutu Chache North": ["Kitutu Chache North", "Mkwajuni", "Mlimani"],
    },
    "Kitutu Chache South": {
      "Kitutu Chache South": ["Kitutu Chache South", "Mkwajuni", "Mlimani"],
    },
    "Nyaribari Chache": {
      "Nyaribari Chache": ["Nyaribari Chache", "Mkwajuni", "Mlimani"],
    },
    "Nyaribari Masaba": {
      "Nyaribari Masaba": ["Nyaribari Masaba", "Mkwajuni", "Mlimani"],
    },
    "South Mugirango": {
      "South Mugirango": ["South Mugirango", "Kisii", "Mkwajuni"],
      "Kisii": ["Kisii", "Mkwajuni", "Mlimani"],
    },
  },
  Nyamira: {
    Borabu: {
      "Borabu": ["Borabu", "Mkwajuni", "Mlimani"],
    },
    Manga: {
      "Manga": ["Manga", "Mkwajuni", "Mlimani"],
    },
    "Masaba North": {
      "Masaba North": ["Masaba North", "Mkwajuni", "Mlimani"],
    },
    "Nyamira North": {
      "Nyamira North": ["Nyamira North", "Mkwajuni", "Mlimani"],
    },
    "Nyamira South": {
      "Nyamira South": ["Nyamira South", "Mkwajuni", "Mlimani"],
    },
  },
  Nairobi: {
    "Dagoretti North": {
      "Dagoretti North": ["Dagoretti North", "Uthiru", "Mkwajuni"],
      "Uthiru": ["Uthiru", "Mkwajuni", "Mlimani"],
    },
    "Dagoretti South": {
      "Dagoretti South": ["Dagoretti South", "Kawangware", "Mkwajuni"],
      "Kawangware": ["Kawangware", "Mkwajuni", "Mlimani"],
    },
    "Embakasi Central": {
      "Embakasi Central": ["Embakasi Central", "Kayole", "Mkwajuni"],
      "Kayole": ["Kayole", "Mkwajuni", "Mlimani"],
    },
    "Embakasi East": {
      "Embakasi East": ["Embakasi East", "Mkwajuni", "Mlimani"],
    },
    "Embakasi North": {
      "Embakasi North": ["Embakasi North", "Kileleshwa", "Mkwajuni"],
      "Kileleshwa": ["Kileleshwa", "Mkwajuni", "Mlimani"],
    },
    "Embakasi South": {
      "Embakasi South": ["Embakasi South", "Mkwajuni", "Mlimani"],
    },
    "Embakasi West": {
      "Embakasi West": ["Embakasi West", "Mukuru", "Mkwajuni"],
      "Mukuru": ["Mukuru", "Mkwajuni", "Mlimani"],
    },
    Kamukunji: {
      "Kamukunji": ["Kamukunji", "Pumwani", "Mkwajuni"],
      "Pumwani": ["Pumwani", "Mkwajuni", "Mlimani"],
    },
    Kasarani: {
      "Kasarani": ["Kasarani", "Hurlingham", "Mkwajuni"],
      "Hurlingham": ["Hurlingham", "Mkwajuni", "Mlimani"],
    },
    Kibra: {
      "Kibra": ["Kibra", "Laini Sopa", "Mkwajuni"],
      "Laini Sopa": ["Laini Sopa", "Mkwajuni", "Mlimani"],
    },
    Langata: {
      "Langata": ["Langata", "Nairobi West", "Mkwajuni"],
      "Nairobi West": ["Nairobi West", "Mkwajuni", "Mlimani"],
    },
    Makadara: {
      "Makadara": ["Makadara", "Mombasa", "Mkwajuni"],
      "Mombasa": ["Mombasa", "Mkwajuni", "Mlimani"],
    },
    Mathare: {
      "Mathare": ["Mathare", "Kariandusi", "Mkwajuni"],
      "Kariandusi": ["Kariandusi", "Mkwajuni", "Mlimani"],
    },
    Njiru: {
      "Njiru": ["Njiru", "Githurai", "Mkwajuni"],
      "Githurai": ["Githurai", "Mkwajuni", "Mlimani"],
    },
    Roysambu: {
      "Roysambu": ["Roysambu", "Kasarani", "Mkwajuni"],
    },
    Ruaraka: {
      "Ruaraka": ["Ruaraka", "Mkwajuni", "Mlimani"],
    },
    Starehe: {
      "Starehe": ["Starehe", "Nairobi Central", "Mkwajuni"],
      "Nairobi Central": ["Nairobi Central", "Mkwajuni", "Mlimani"],
    },
    "Westlands": {
      "Westlands": ["Westlands", "Kabete", "Mkwajuni"],
      "Kabete": ["Kabete", "Mkwajuni", "Mlimani"],
    },
  },
};

export function getCounties(): string[] {
  return Object.keys(countyData);
}

export function getSubCounties(county: string): string[] {
  return Object.keys(countyData[county] || {});
}

export function getWards(county: string, subCounty: string): string[] {
  return Object.keys(countyData[county]?.[subCounty] || {});
}

export function getLocations(county: string, subCounty: string, ward: string): string[] {
  const locations = countyData[county]?.[subCounty]?.[ward] || [];
  const filtered = locations.filter(
    (loc) => loc !== "Mkwajuni" && loc !== "Mlimani"
  );
  return filtered.length ? filtered : [ward];
}
