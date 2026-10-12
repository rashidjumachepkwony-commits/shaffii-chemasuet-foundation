export const countries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi", "South Sudan", "Ethiopia", "Other"];

export const countyData: Record<string, Record<string, Record<string, string[]>>> = {
  Mombasa: {
    Changamwe: {
      "Airport": ["Mombasa Airport", "Port Rehani", "Changamwe Kuu"],
      "Bombululu": ["Bombululu", "Magogoni", "Kizingini"],
    },
    Jomvu: {
      "Jomvu": ["Migombani", "Shangrila", "Mombasa Cement", "Mwalimu", "Jomvu Kuu"],
      "Miritini": ["Miritini", "Kikambani", "Mwasongani"],
    },
    Kisauni: {
      "Mtwapa": ["Mikindani", "Mtwapa Kijiji", "Mvumo", "Msabitini"],
      "Ruaraka": ["Ruaraka", "Kikuyu", "Mishra"],
      "Kisauni": ["Kisauni", "Kariokor", "Mji wa Huruma"],
    },
    Likoni: {
      "Likoni": ["Majengo", "Bofa", "Kipuyu", "Mapenzi"],
      "Uwanja wa Ngiri": ["Uwanja wa Ngiri", "Mikocheni", "Kichwa Kuu"],
    },
    Mvita: {
      "Mombasa Town West": ["Mnazi Mmoja", "Mlimani", "Mazizini", "Shauri Moyo", "Majengo"],
      "Mombasa Town East": ["Kisauni", "Miranzi", "Mombasa Golf Club", "Ndogan"],
    },
    Nyali: {
      "Nyali": ["Nyali", "Miran", "Kurawa", "Mjini"],
      "Kisauni": ["Kisauni", "Bombolulu", "Mvutani"],
    },
  },
  Kwale: {
    Kinango: {
      "Kinango": ["Kinango", "Mwaheru", "Mkinga Mpembeni", "Mabawa"],
      "Kasigau": ["Kasigau", "Mlimani", "Mwasora"],
    },
    Lungalunga: {
      "Lungalunga": ["Lungalunga", "Mwaele", "Mtaani", "Mweru"],
      "Kigoma": ["Kigoma", "Mkwajuni", "Mchangamano"],
    },
    Matuga: {
      "Matuga": ["Matuga", "Mavumvi", "Mshwenge", "Mkindo"],
      "Kibunduru": ["Kibunduru", "Mkomazi", "Mlimani"],
    },
    Msambweni: {
      "Msambweni": ["Msambweni", "Makalani", "Mijangwani"],
      "Shumba": ["Shumba", "Mkwajuni", "Mkoroshoni"],
    },
  },
  Kilifi: {
    Ganze: {
      "Ganze": ["Ganze", "Mkwajuni", "Mshamba"],
      "Mwarumbu": ["Mwarumbu", "Chumvini", "Matiburi"],
      "Chakwa": ["Chakwa", "Kikunguni", "Matiburi"],
    },
    Kaloleni: {
      "Kaloleni": ["Kaloleni", "Maricau", "Mtondia"],
      "Ribe": ["Ribe", "Kikunguni", "Mlandizi"],
      "Karoni": ["Karoni", "Mshamba", "Mchangaruva"],
    },
    "Kilifi North": {
      "Malindi": ["Malindi", "Kakuyuni", "Mijakini", "Malindi Airport"],
      "Kihoto": ["Kihoto", "Ganda", "Mkwajuni"],
    },
    "Kilifi South": {
      "Mombasa": ["Mombasa", "Maweni", "Junction"],
      "Ndavaya": ["Ndavaya", "Mkwajuni", "Mlimani"],
    },
    Magarini: {
      "Magarini": ["Magarini", "Marafa", "Kikunguni"],
      "Sokoni": ["Sokoni", "Tudor", "Mkwajuni"],
    },
    Malindi: {
      "Malindi Town": ["Malindi Town", "Kakuyuni", "Mijakini"],
      "Malindi Rural": ["Malindi Rural", "Gandini", "Marafa"],
    },
    Rabai: {
      "Rabai": ["Rabai", "Bombolulu", "Kikunguni"],
      "Kisauni": ["Kisauni", "Mkwajuni", "Mlimani"],
    },
  },
  "Tana River": {
    Bura: {
      "Bura": ["Bura", "Kipumbuni", "Mkwajuni"],
      "Garissa": ["Garissa", "Mkwajuni", "Mlimani"],
    },
    Galole: {
      "Galole": ["Galole", "Hulugho", "Ijara"],
      "Mikindani": ["Mikindani", "Kifaru", "Mlimani"],
    },
    Garsen: {
      "Garsen": ["Garsen", "Witu", "Mkwajuni"],
      "Tharaka": ["Tharaka", "Chyulu", "Mlimani"],
    },
  },
  Lamu: {
    "Lamu East": {
      "Faza": ["Faza", "Pate", "Fumba"],
      "Pate": ["Pate", "Faza", "Shanga"],
    },
    "Lamu West": {
      "Lamu": ["Lamu", "Shela", "Mkokoteni"],
      "Mokowe": ["Mokowe", "Hiriwe", "Kizingini"],
    },
  },
  "Taita/Taveta": {
    Mwatate: {
      "Mwatate": ["Mwatate", "Mwarumonde", "Mbuguni"],
      "Voi": ["Voi", "Mkwajuni", "Mlimani"],
    },
    Taveta: {
      "Taveta": ["Taveta", "Geduke", "Mkwajuni"],
      "Mitsuru": ["Mitsuru", "Mlimani", "Mkwajuni"],
    },
    Voi: {
      "Voi Town": ["Voi Town", "Mkwajuni", "Mlimani"],
      "Makueni": ["Makueni", "Mkwajuni", "Mlimani"],
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
      "Buuri": ["Buuri", "Mkwajuni", "Mlimani"],
      "Maua": ["Maua", "Mkwajuni", "Mlimani"],
      "Nchogeta": ["Nchogeta", "Mkwajuni", "Mlimani"],
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
      "Kitui Central": ["Kitui Central", "Mkwajuni", "Mlimani"],
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
      "Mwingi Central": ["Mwingi Central", "Mkwajuni", "Mlimani"],
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
      "Athi River": ["Athi River", "Mkwajuni", "Mlimani"],
      "Mlolongo": ["Mlolongo", "Mkwajuni", "Mlimani"],
    },
    Kangundo: {
      "Kangundo": ["Kangundo", "Mkwajuni", "Mlimani"],
      "Meli": ["Meli", "Mkwajuni", "Mlimani"],
    },
    Kathiani: {
      "Kathiani": ["Kathiani", "Mkwajuni", "Mlimani"],
    },
    "Machakos Town": {
      "Machakos Town": ["Machakos Town", "Mkwajuni", "Mlimani"],
      "Mukuyu": ["Mukuyu", "Mkwajuni", "Mlimani"],
    },
    Masinga: {
      "Masinga": ["Masinga", "Mkwajuni", "Mlimani"],
      "Mukurain": ["Mukurain", "Mkwajuni", "Mlimani"],
    },
    Matungulu: {
      "Matungulu": ["Matungulu", "Mkwajuni", "Mlimani"],
      "Kavunani": ["Kavunani", "Mkwajuni", "Mlimani"],
    },
    Mavoko: {
      "Mavoko": ["Mavoko", "Mkwajuni", "Mlimani"],
      "Athi River": ["Athi River", "Mkwajuni", "Mlimani"],
    },
    Mwala: {
      "Mwala": ["Mwala", "Mkwajuni", "Mlimani"],
      "Kikumba": ["Kikumba", "Mkwajuni", "Mlimani"],
    },
    Yatta: {
      "Yatta": ["Yatta", "Mkwajuni", "Mlimani"],
    },
  },
  Makueni: {
    Kaiti: {
      "Kaiti": ["Kaiti", "Mkwajuni", "Mlimani"],
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
      "Mbooni": ["Mbooni", "Mkwajuni", "Mlimani"],
      "Mbolai": ["Mbolai", "Mkwajuni", "Mlimani"],
    },
    Mukaa: {
      "Mukaa": ["Mukaa", "Mkwajuni", "Mlimani"],
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
      "Kieni": ["Kieni", "Mkwajuni", "Mlimani"],
      "Nyeri": ["Nyeri", "Mkwajuni", "Mlimani"],
    },
    "Kieni East": {
      "Kieni East": ["Kieni East", "Mkwajuni", "Mlimani"],
    },
    Mathira: {
      "Mathira": ["Mathira", "Mkwajuni", "Mlimani"],
      "Kahatia": ["Kahatia", "Mkwajuni", "Mlimani"],
    },
    Mukurweini: {
      "Mukurweini": ["Mukurweini", "Mkwajuni", "Mlimani"],
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
      "Gichugu": ["Gichugu", "Mkwajuni", "Mlimani"],
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
      "Mwea": ["Mwea", "Mkwajuni", "Mlimani"],
      "Tebu": ["Tebu", "Mkwajuni", "Mlimani"],
    },
  },
  "Murang'a": {
    Gatanga: {
      "Gatanga": ["Gatanga", "Mkwajuni", "Mlimani"],
      "Kinyua": ["Kinyua", "Mkwajuni", "Mlimani"],
    },
    Kandara: {
      "Kandara": ["Kandara", "Mkwajuni", "Mlimani"],
      "Sagana": ["Sagana", "Mkwajuni", "Mlimani"],
    },
    Kangema: {
      "Kangema": ["Kangema", "Mkwajuni", "Mlimani"],
    },
    Kigumo: {
      "Kigumo": ["Kigumo", "Mkwajuni", "Mlimani"],
      "Tulagi": ["Tulagi", "Mkwajuni", "Mlimani"],
    },
    Kiharu: {
      "Kiharu": ["Kiharu", "Mkwajuni", "Mlimani"],
      "Mukuyu": ["Mukuyu", "Mkwajuni", "Mlimani"],
    },
    Maragua: {
      "Maragua": ["Maragua", "Mkwajuni", "Mlimani"],
      "Madiba": ["Madiba", "Mkwajuni", "Mlimani"],
    },
    Mathioya: {
      "Mathioya": ["Mathioya", "Mkwajuni", "Mlimani"],
    },
  },
  Kiambu: {
    "Gatundu North": {
      "Gatundu North": ["Gatundu North", "Mkwajuni", "Mlimani"],
      "Kiganjo": ["Kiganjo", "Mkwajuni", "Mlimani"],
    },
    "Gatundu South": {
      "Gatundu South": ["Gatundu South", "Mkwajuni", "Mlimani"],
    },
    Githunguri: {
      "Githunguri": ["Githunguri", "Mkwajuni", "Mlimani"],
      "Mukuyu": ["Mukuyu", "Mkwajuni", "Mlimani"],
    },
    Juja: {
      "Juja": ["Juja", "Mkwajuni", "Mlimani"],
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
      "Kikuyu": ["Kikuyu", "Mkwajuni", "Mlimani"],
      "Gikambura": ["Gikambura", "Mkwajuni", "Mlimani"],
    },
    Lari: {
      "Lari": ["Lari", "Mkwajuni", "Mlimani"],
      "Kinale": ["Kinale", "Mkwajuni", "Mlimani"],
    },
    Limuru: {
      "Limuru": ["Limuru", "Mkwajuni", "Mlimani"],
      "Ndareru": ["Ndareru", "Mkwajuni", "Mlimani"],
    },
    Ruiru: {
      "Ruiru": ["Ruiru", "Mkwajuni", "Mlimani"],
      "Mwiki": ["Mwiki", "Mkwajuni", "Mlimani"],
    },
    "Thika Town": {
      "Thika Town": ["Thika Town", "Mkwajuni", "Mlimani"],
    },
  },
  Turkana: {
    Kibish: {
      "Kibish": ["Kibish", "Mkwajuni", "Mlimani"],
      "Orpa": ["Orpa", "Mkwajuni", "Mlimani"],
    },
    Loima: {
      "Loima": ["Loima", "Mkwajuni", "Mlimani"],
    },
    "Turkana Central": {
      "Turkana Central": ["Turkana Central", "Mkwajuni", "Mlimani"],
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
      "Kacheliba": ["Kacheliba", "Mkwajuni", "Mlimani"],
      "Kasei": ["Kasei", "Mkwajuni", "Mlimani"],
    },
    Kapenguria: {
      "Kapenguria": ["Kapenguria", "Mkwajuni", "Mlimani"],
      "Tuliyapak": ["Tuliyapak", "Mkwajuni", "Mlimani"],
    },
    "Pokot South": {
      "Pokot South": ["Pokot South", "Mkwajuni", "Mlimani"],
      "Biyoon": ["Biyoon", "Mkwajuni", "Mlimani"],
    },
    Sigor: {
      "Sigor": ["Sigor", "Mkwajuni", "Mlimani"],
      "Kipkelion": ["Kipkelion", "Mkwajuni", "Mlimani"],
    },
    "West Pokot": {
      "West Pokot": ["West Pokot", "Mkwajuni", "Mlimani"],
      "Kapenguria": ["Kapenguria", "Mkwajuni", "Mlimani"],
    },
  },
  Samburu: {
    "Samburu East": {
      "Samburu East": ["Samburu East", "Mkwajuni", "Mlimani"],
      "Wamba": ["Wamba", "Mkwajuni", "Mlimani"],
    },
    "Samburu North": {
      "Samburu North": ["Samburu North", "Mkwajuni", "Mlimani"],
      "Lokich": ["Lokich", "Mkwajuni", "Mlimani"],
    },
    "Samburu West": {
      "Samburu West": ["Samburu West", "Mkwajuni", "Mlimani"],
      "Maralal": ["Maralal", "Mkwajuni", "Mlimani"],
    },
  },
  "Trans Nzoia": {
    Cherangany: {
      "Cherangany": ["Cherangany", "Mkwajuni", "Mlimani"],
      "Kapteng": ["Kapteng", "Mkwajuni", "Mlimani"],
    },
    Endebess: {
      "Endebess": ["Endebess", "Mkwajuni", "Mlimani"],
      "Sikhendu": ["Sikhendu", "Mkwajuni", "Mlimani"],
    },
    Kwanza: {
      "Kwanza": ["Kwanza", "Mkwajuni", "Mlimani"],
    },
    Saboti: {
      "Saboti": ["Saboti", "Mkwajuni", "Mlimani"],
      "Tula": ["Tula", "Mkwajuni", "Mlimani"],
    },
    Kiminini: {
      "Kiminini": ["Kiminini", "Mkwajuni", "Mlimani"],
      "Cheptuyek": ["Cheptuyek", "Mkwajuni", "Mlimani"],
    },
  },
  "Uasin Gishu": {
    Ainabkoi: {
      "Ainabkoi": ["Ainabkoi", "Mkwajuni", "Mlimani"],
      "Kapilkilmat": ["Kapilkilmat", "Mkwajuni", "Mlimani"],
    },
    Kapseret: {
      "Kapseret": ["Kapseret", "Mkwajuni", "Mlimani"],
      "Kapsabet": ["Kapsabet", "Mkwajuni", "Mlimani"],
    },
    Kesses: {
      "Kesses": ["Kesses", "Mkwajuni", "Mlimani"],
      "Kapsabet": ["Kapsabet", "Mkwajuni", "Mlimani"],
    },
    Moiben: {
      "Moiben": ["Moiben", "Mkwajuni", "Mlimani"],
      "Cheptelu": ["Cheptelu", "Mkwajuni", "Mlimani"],
    },
    Soy: {
      "Soy": ["Soy", "Mkwajuni", "Mlimani"],
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
      "Marakwet East": ["Marakwet East", "Mkwajuni", "Mlimani"],
      "Kapsaram": ["Kapsaram", "Mkwajuni", "Mlimani"],
    },
    "Marakwet West": {
      "Marakwet West": ["Marakwet West", "Mkwajuni", "Mlimani"],
      "Tenges": ["Tenges", "Mkwajuni", "Mlimani"],
    },
  },
  Nandi: {
    Aldai: {
      "Aldai": ["Aldai", "Mkwajuni", "Mlimani"],
      "Soba": ["Soba", "Mkwajuni", "Mlimani"],
    },
    Chesumei: {
      "Chesumei": ["Chesumei", "Mkwajuni", "Mlimani"],
    },
    Emgwen: {
      "Emgwen": ["Emgwen", "Mkwajuni", "Mlimani"],
      "Kapsabet": ["Kapsabet", "Mkwajuni", "Mlimani"],
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
      "Baringo Central": ["Baringo Central", "Mkwajuni", "Mlimani"],
      "Mogot": ["Mogot", "Mkwajuni", "Mlimani"],
    },
    "Baringo North": {
      "Baringo North": ["Baringo North", "Mkwajuni", "Mlimani"],
    },
    "Baringo South": {
      "Baringo South": ["Baringo South", "Mkwajuni", "Mlimani"],
    },
    "Eldama Ravine": {
      "Eldama Ravine": ["Eldama Ravine", "Mkwajuni", "Mlimani"],
      "Maralal": ["Maralal", "Mkwajuni", "Mlimani"],
    },
    Mogotio: {
      "Mogotio": ["Mogotio", "Mkwajuni", "Mlimani"],
      "Kipsaram": ["Kipsaram", "Mkwajuni", "Mlimani"],
    },
    Tiaty: {
      "Tiaty": ["Tiaty", "Mkwajuni", "Mlimani"],
    },
  },
  Laikipia: {
    "Laikipia Central": {
      "Laikipia Central": ["Laikipia Central", "Mkwajuni", "Mlimani"],
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
      "Bahati": ["Bahati", "Mkwajuni", "Mlimani"],
      "Lanet": ["Lanet", "Mkwajuni", "Mlimani"],
    },
    Gilgil: {
      "Gilgil": ["Gilgil", "Mkwajuni", "Mlimani"],
      "Malewa": ["Malewa", "Mkwajuni", "Mlimani"],
    },
    "Kuresoi North": {
      "Kuresoi North": ["Kuresoi North", "Mkwajuni", "Mlimani"],
    },
    "Kuresoi South": {
      "Kuresoi South": ["Kuresoi South", "Mkwajuni", "Mlimani"],
    },
    Molo: {
      "Molo": ["Molo", "Mkwajuni", "Mlimani"],
      "Elburgon": ["Elburgon", "Mkwajuni", "Mlimani"],
    },
    Naivasha: {
      "Naivasha": ["Naivasha", "Mkwajuni", "Mlimani"],
      "Mai Mahiu": ["Mai Mahiu", "Mkwajuni", "Mlimani"],
    },
    "Nakuru Town East": {
      "Nakuru Town East": ["Nakuru Town East", "Mkwajuni", "Mlimani"],
    },
    "Nakuru Town West": {
      "Nakuru Town West": ["Nakuru Town West", "Mkwajuni", "Mlimani"],
    },
    Njoro: {
      "Njoro": ["Njoro", "Mkwajuni", "Mlimani"],
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
      "Kilgoris": ["Kilgoris", "Mkwajuni", "Mlimani"],
      "Lolshogian": ["Lolshogian", "Mkwajuni", "Mlimani"],
    },
    "Narok East": {
      "Narok East": ["Narok East", "Mkwajuni", "Mlimani"],
    },
    "Narok North": {
      "Narok North": ["Narok North", "Mkwajuni", "Mlimani"],
      "Osupek": ["Osupek", "Mkwajuni", "Mlimani"],
    },
    "Narok South": {
      "Narok South": ["Narok South", "Mkwajuni", "Mlimani"],
      "Esok": ["Esok", "Mkwajuni", "Mlimani"],
    },
    "Narok West": {
      "Narok West": ["Narok West", "Mkwajuni", "Mlimani"],
    },
  },
  Kajiado: {
    Isinya: {
      "Isinya": ["Isinya", "Mkwajuni", "Mlimani"],
      "Kitengela": ["Kitengela", "Mkwajuni", "Mlimani"],
    },
    "Kajiado Central": {
      "Kajiado Central": ["Kajiado Central", "Mkwajuni", "Mlimani"],
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
      "Loitokitok": ["Loitokitok", "Mkwajuni", "Mlimani"],
      "Rongai": ["Rongai", "Mkwajuni", "Mlimani"],
    },
    Mashuuru: {
      "Mashuuru": ["Mashuuru", "Mkwajuni", "Mlimani"],
    },
  },
  Kericho: {
    Ainamoi: {
      "Ainamoi": ["Ainamoi", "Mkwajuni", "Mlimani"],
      "Cheptiret": ["Cheptiret", "Mkwajuni", "Mlimani"],
    },
    Belgut: {
      "Belgut": ["Belgut", "Mkwajuni", "Mlimani"],
    },
    Bureti: {
      "Bureti": ["Bureti", "Mkwajuni", "Mlimani"],
      "Londiani": ["Londiani", "Mkwajuni", "Mlimani"],
    },
    "Kipkelion East": {
      "Kipkelion East": ["Kipkelion East", "Mkwajuni", "Mlimani"],
      "Kipkelion": ["Kipkelion", "Mkwajuni", "Mlimani"],
    },
    "Kipkelion West": {
      "Kipkelion West": ["Kipkelion West", "Mkwajuni", "Mlimani"],
    },
    Sigowet: {
      "Sigowet": ["Sigowet", "Mkwajuni", "Mlimani"],
      "Kapsabet": ["Kapsabet", "Mkwajuni", "Mlimani"],
    },
  },
  Bomet: {
    "Bomet Central": {
      "Bomet Central": ["Bomet Central", "Mkwajuni", "Mlimani"],
      "Bomet": ["Bomet", "Mkwajuni", "Mlimani"],
    },
    "Bomet East": {
      "Bomet East": ["Bomet East", "Mkwajuni", "Mlimani"],
      "Kembu": ["Kembu", "Mkwajuni", "Mlimani"],
    },
    Chepalungu: {
      "Chepalungu": ["Chepalungu", "Mkwajuni", "Mlimani"],
    },
    Konoin: {
      "Konoin": ["Konoin", "Mkwajuni", "Mlimani"],
      "Leboo": ["Leboo", "Mkwajuni", "Mlimani"],
    },
    Sotik: {
      "Sotik": ["Sotik", "Mkwajuni", "Mlimani"],
      "Kaplumbety": ["Kaplumbety", "Mkwajuni", "Mlimani"],
    },
  },
  Kakamega: {
    Butere: {
      "Butere": ["Butere", "Mkwajuni", "Mlimani"],
      "Khwale": ["Khwale", "Mkwajuni", "Mlimani"],
    },
    Khwisero: {
      "Khwisero": ["Khwisero", "Mkwajuni", "Mlimani"],
    },
    Likuyani: {
      "Likuyani": ["Likuyani", "Mkwajuni", "Mlimani"],
    },
    Lugari: {
      "Lugari": ["Lugari", "Mkwajuni", "Mlimani"],
      "Chepchugui": ["Chepchugui", "Mkwajuni", "Mlimani"],
    },
    Malava: {
      "Malava": ["Malava", "Mkwajuni", "Mlimani"],
    },
    "Mumias East": {
      "Mumias East": ["Mumias East", "Mkwajuni", "Mlimani"],
      "Mumias": ["Mumias", "Mkwajuni", "Mlimani"],
    },
    "Mumias West": {
      "Mumias West": ["Mumias West", "Mkwajuni", "Mlimani"],
      "Shinyalu": ["Shinyalu", "Mkwajuni", "Mlimani"],
    },
    Navakholo: {
      "Navakholo": ["Navakhoho", "Mkwajuni", "Mlimani"],
      "Kakamega": ["Kakamega", "Mkwajuni", "Mlimani"],
    },
    Lurambi: {
      "Lurambi": ["Lurambi", "Mkwajuni", "Mlimani"],
    },
    Ikolomani: {
      "Ikolomani": ["Ikolomani", "Mkwajuni", "Mlimani"],
      "Kisumu": ["Kisumu", "Mkwajuni", "Mlimani"],
    },
    Matungu: {
      "Matungu": ["Matungu", "Mkwajuni", "Mlimani"],
      "Kakoneni": ["Kakoneni", "Mkwajuni", "Mlimani"],
    },
    Shinyalu: {
      "Shinyalu": ["Shinyalu", "Mkwajuni", "Mlimani"],
      "Kibwezi": ["Kibwezi", "Mkwajuni", "Mlimani"],
    },
  },
  Vihiga: {
    Emuhaya: {
      "Emuhaya": ["Emuhaya", "Mkwajuni", "Mlimani"],
      "Vihiga": ["Vihiga", "Mkwajuni", "Mlimani"],
    },
    Hamisi: {
      "Hamisi": ["Hamisi", "Mkwajuni", "Mlimani"],
    },
    Luanda: {
      "Luanda": ["Luanda", "Mkwajuni", "Mlimani"],
      "Mbale": ["Mbale", "Mkwajuni", "Mlimani"],
    },
    Sabatia: {
      "Sabatia": ["Sabatia", "Mkwajuni", "Mlimani"],
    },
    Vihiga: {
      "Vihiga": ["Vihiga", "Mkwajuni", "Mlimani"],
      "Maji": ["Maji", "Mkwajuni", "Mlimani"],
    },
  },
  Bungoma: {
    Bumula: {
      "Bumula": ["Bumula", "Mkwajuni", "Mlimani"],
    },
    Kabuchai: {
      "Kabuchai": ["Kabuchai", "Mkwajuni", "Mlimani"],
      "Bukembe": ["Bukemu", "Mkwajuni", "Mlimani"],
    },
    Kanduyi: {
      "Kanduyi": ["Kanduyi", "Mkwajuni", "Mlimani"],
      "Bungoma": ["Bungoma", "Mkwajuni", "Mlimani"],
    },
    Kimilili: {
      "Kimilili": ["Kimilili", "Mkwajuni", "Mlimani"],
      "Kapsokoy": ["Kapsokoy", "Mkwajuni", "Mlimani"],
    },
    "Mt Elgon": {
      "Mt Elgon": ["Mt Elgon", "Mkwajuni", "Mlimani"],
      "Kapkenyi": ["Kapkunyi", "Mkwajuni", "Mlimani"],
    },
    Sirisia: {
      "Sirisia": ["Sirisia", "Mkwajuni", "Mlimani"],
      "Lelmoru": ["Lelmoru", "Mkwajuni", "Mlimani"],
    },
    Tongaren: {
      "Tongaren": ["Tongaren", "Mkwajuni", "Mlimani"],
    },
    "Webuye East": {
      "Webuye East": ["Webuye East", "Mkwajuni", "Mlimani"],
      "Webuye": ["Webuye", "Mkwajuni", "Mlimani"],
    },
    "Webuye West": {
      "Webuye West": ["Webuye West", "Mkwajuni", "Mlimani"],
    },
  },
  Busia: {
    Budalangi: {
      "Budalangi": ["Budalangi", "Mkwajuni", "Mlimani"],
      "Port": ["Port", "Mkwajuni", "Mlimani"],
    },
    Butula: {
      "Butula": ["Butula", "Mkwajuni", "Mlimani"],
    },
    Funyula: {
      "Funyula": ["Funyula", "Mkwajuni", "Mlimani"],
      "Musanda": ["Musanda", "Mkwajuni", "Mlimani"],
    },
    Matayos: {
      "Matayos": ["Matayos", "Mkwajuni", "Mlimani"],
      "Leganga": ["Leganga", "Mkwajuni", "Mlimani"],
    },
    Nambale: {
      "Nambale": ["Nambale", "Mkwajuni", "Mlimani"],
    },
    "Teso North": {
      "Teso North": ["Teso North", "Mkwajuni", "Mlimani"],
      "Amusus": ["Amusus", "Mkwajuni", "Mlimani"],
    },
    "Teso South": {
      "Teso South": ["Teso South", "Mkwajuni", "Mlimani"],
    },
  },
  Siaya: {
    "Alego Usonga": {
      "Alego Usonga": ["Alego Usonga", "Mkwajuni", "Mlimani"],
      "Ukwala": ["Ukwala", "Mkwajuni", "Mlimani"],
    },
    Bondo: {
      "Bondo": ["Bondo", "Mkwajuni", "Mlimani"],
      "Sokoni": ["Sokoni", "Mkwajuni", "Mlimani"],
    },
    Gem: {
      "Gem": ["Gem", "Mkwajuni", "Mlimani"],
      "Wundo": ["Wundo", "Mkwajuni", "Mlimani"],
    },
    Rarieda: {
      "Rarieda": ["Rarieda", "Mkwajuni", "Mlimani"],
      "Muhoroni": ["Muhoroni", "Mkwajuni", "Mlimani"],
    },
    Ugenya: {
      "Ugenya": ["Ugenya", "Mkwajuni", "Mlimani"],
      "Uyuu": ["Uyuu", "Mkwajuni", "Mlimani"],
    },
    Ugunja: {
      "Ugunja": ["Ugunja", "Mkwajuni", "Mlimani"],
    },
  },
  Kisumu: {
    "Kisumu Central": {
      "Kisumu Central": ["Kisumu Central", "Mkwajuni", "Mlimani"],
      "Kisumu": ["Kisumu", "Mkwajuni", "Mlimani"],
    },
    "Kisumu East": {
      "Kisumu East": ["Kisumu East", "Mkwajuni", "Mlimani"],
      "Kisumu": ["Kisumu", "Mkwajuni", "Mlimani"],
    },
    "Kisumu West": {
      "Kisumu West": ["Kisumu West", "Mkwajuni", "Mlimani"],
    },
    Muhoroni: {
      "Muhoroni": ["Muhoroni", "Mkwajuni", "Mlimani"],
      "Kibos": ["Kibos", "Mkwajuni", "Mlimani"],
    },
    Nyakach: {
      "Nyakach": ["Nyakach", "Mkwajuni", "Mlimani"],
    },
    Nyando: {
      "Nyando": ["Nyando", "Mkwajuni", "Mlimani"],
      "Kisumu": ["Kisumu", "Mkwajuni", "Mlimani"],
    },
    Seme: {
      "Seme": ["Seme", "Mkwajuni", "Mlimani"],
    },
  },
  "Homa Bay": {
    "Hombasa Town": {
      "Hombasa Town": ["Hombasa Town", "Mkwajuni", "Mlimani"],
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
      "Awendo": ["Awendo", "Mkwajuni", "Mlimani"],
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
      "Nyatike": ["Nyatike", "Mkwajuni", "Mlimani"],
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
      "Bobasi": ["Bobasi", "Mkwajuni", "Mlimani"],
      "Masimbi": ["Masimbi", "Mkwajuni", "Mlimani"],
    },
    "Bomachoge Borabu": {
      "Bomachoge Borabu": ["Bomachoge Borabu", "Mkwajuni", "Mlimani"],
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
      "South Mugirango": ["South Mugirango", "Mkwajuni", "Mlimani"],
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
      "Dagoretti North": ["Dagoretti North", "Mkwajuni", "Mlimani"],
      "Uthiru": ["Uthiru", "Mkwajuni", "Mlimani"],
    },
    "Dagoretti South": {
      "Dagoretti South": ["Dagoretti South", "Mkwajuni", "Mlimani"],
      "Kawangware": ["Kawangware", "Mkwajuni", "Mlimani"],
    },
    "Embakasi Central": {
      "Embakasi Central": ["Embakasi Central", "Mkwajuni", "Mlimani"],
      "Kayole": ["Kayole", "Mkwajuni", "Mlimani"],
    },
    "Embakasi East": {
      "Embakasi East": ["Embakasi East", "Mkwajuni", "Mlimani"],
    },
    "Embakasi North": {
      "Embakasi North": ["Embakasi North", "Mkwajuni", "Mlimani"],
      "Kileleshwa": ["Kileleshwa", "Mkwajuni", "Mlimani"],
    },
    "Embakasi South": {
      "Embakasi South": ["Embakasi South", "Mkwajuni", "Mlimani"],
    },
    "Embakasi West": {
      "Embakasi West": ["Embakasi West", "Mkwajuni", "Mlimani"],
      "Mukuru": ["Mukuru", "Mkwajuni", "Mlimani"],
    },
    Kamukunji: {
      "Kamukunji": ["Kamukunji", "Mkwajuni", "Mlimani"],
      "Pumwani": ["Pumwani", "Mkwajuni", "Mlimani"],
    },
    Kasarani: {
      "Kasarani": ["Kasarani", "Mkwajuni", "Mlimani"],
      "Hurlingham": ["Hurlingham", "Mkwajuni", "Mlimani"],
    },
    Kibra: {
      "Kibra": ["Kibra", "Mkwajuni", "Mlimani"],
      "Laini Sopa": ["Laini Sopa", "Mkwajuni", "Mlimani"],
    },
    Langata: {
      "Langata": ["Langata", "Mkwajuni", "Mlimani"],
      "Nairobi West": ["Nairobi West", "Mkwajuni", "Mlimani"],
    },
    Makadara: {
      "Makadara": ["Makadara", "Mkwajuni", "Mlimani"],
      "Mombasa": ["Mombasa", "Mkwajuni", "Mlimani"],
    },
    Mathare: {
      "Mathare": ["Mathare", "Mkwajuni", "Mlimani"],
      "Kariandusi": ["Kariandusi", "Mkwajuni", "Mlimani"],
    },
    Njiru: {
      "Njiru": ["Njiru", "Mkwajuni", "Mlimani"],
      "Githurai": ["Githurai", "Mkwajuni", "Mlimani"],
    },
    Roysambu: {
      "Roysambu": ["Roysambu", "Mkwajuni", "Mlimani"],
      "Kasarani": ["Kasarani", "Mkwajuni", "Mlimani"],
    },
    Ruaraka: {
      "Ruaraka": ["Ruaraka", "Mkwajuni", "Mlimani"],
    },
    Starehe: {
      "Starehe": ["Starehe", "Mkwajuni", "Mlimani"],
      "Nairobi Central": ["Nairobi Central", "Mkwajuni", "Mlimani"],
    },
    "Westlands": {
      "Westlands": ["Westlands", "Mkwajuni", "Mlimani"],
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
  return countyData[county]?.[subCounty]?.[ward] || [];
}
