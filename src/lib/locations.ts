export const countries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi", "South Sudan", "Ethiopia", "Other"];

export const countyData: Record<string, Record<string, Record<string, string[]>>> = {
  "Mombasa": {
    "Mvita": {
      "Mombasa Town West": ["Mnazi Mmoja", "Mlimani", "Mazizini", "Shauri Moyo", "Majengo"],
      "Mombasa Town East": ["Kisauni", "Miranzi", "Mombasa Golf Club", "Ndogan"],
    },
    "Jomvu": {
      "Jomvu": ["Migombani", "Shangrila", "Mombasa Cement", "Mwalimu", "Jomvu Kuu"],
    },
    "Kisauni": {
      "Mtwapa": ["Mikindani", "Mtwapa Kijiji", "Mvumo", "Msabitini"],
    },
  },
  "Kwale": {
    "Kikongo": {
      "Kikongo": ["Kikongo", "Bwiti", "Kinarkoma", "Mweru"],
    },
    "Kinango": {
      "Kinango": ["Kinango", "Mwaheru", "Mkinga Mpembeni", "Mabawa"],
    },
    "Lungal": {
      "Lungal": ["Lungal", "Mwaele", "Mtaani", "Mweru"],
    },
  },
  "Kilifi": {
    "Kilifi North": {
      "Malindi Town": ["Malindi", "Kakuyuni", "Mijakini"],
    },
    "Kilifi South": {
      "Mombasa Road": ["Kibarua", "Mikindani", "Mkwajuni"],
    },
  },
  "Nairobi": {
    "Westlands": {
      "Westlands": ["Westlands", "Kabete", "Githurai", "Riruta"],
      "Kasarani": ["Kasarani", "Mwiki", "Ruaraka"],
    },
    "Nairobi West": {
      "Langata": ["Langata", "Kibera", "Nairobi National Park"],
      "Nairobi East": ["Umoja", "Kasarani", "Donholm"],
    },
    "Dagoretti": {
      "Dagoretti": ["Dagoretti", "Karen", "Langata"],
    },
    "Embakasi": {
      "Embakasi": ["Embakasi", "Kasarani", "Ruaraka"],
    },
    "Nairobi North": {
      "Nairobi North": ["Nairobi North", "Kasarani", "Ruaraka"],
    },
  },
  "Kiambu": {
    "Kiambu Town": {
      "Kiambu Town": ["Kiambu", "Kasarani", "Githurai"],
    },
    "Thika": {
      "Thika": ["Thika", "Kiganjo", "Mang'u"],
    },
  },
  "Kisumu": {
    "Kisumu East": {
      "Kisumu East": ["Kisumu", "Ahero", "Muhoroni"],
    },
    "Kisumu West": {
      "Kisumu West": ["Kisumu", "Ahero", "Muhoroni"],
    },
  },
  "Nakuru": {
    "Nakuru East": {
      "Nakuru East": ["Nakuru", "Naivasha", "Narumoru"],
    },
    "Nakuru West": {
      "Nakuru West": ["Nakuru", "Naivasha", "Narumoru"],
    },
  },
  "Uasin Gishu": {
    "Eldoret West": {
      "Soy": ["Soy", "Cheptiret", "Kapsabet"],
    },
    "Eldoret East": {
      "Eldoret East": ["Eldoret", "Chepkoi", "Kapsabet"],
    },
  },
  "Meru": {
    "Meru East": {
      "Meru East": ["Meru", "Maua", "Nkubu"],
    },
    "Meru West": {
      "Meru West": ["Meru", "Maua", "Nkubu"],
    },
  },
  "Machakos": {
    "Machakos Town": {
      "Machakos Town": ["Machakos", "Masinga", "Mavoko"],
    },
    "Masinga": {
      "Masinga": ["Masinga", "Makune", "Kyanzao"],
    },
  },
  "Kisii": {
    "Kisii East": {
      "Kisii East": ["Kisii", "Kenyenke", "Esaki"],
    },
    "Kisii West": {
      "Kisii West": ["Kisii", "Kenyenke", "Esaki"],
    },
  },
  "Homa Bay": {
    "Homa Bay Town": {
      "Homa Bay Town": ["Homa Bay", "Muhoroni", "Suna"],
    },
  },
  "Migori": {
    "Migori": {
      "Migori": ["Migori", "Awendo", "Uran"],
    },
  },
  "Trans Nzoia": {
    "Trans Nzoia West": {
      "Trans Nzoia West": ["Kitale", "Endebess", "Kwanza"],
    },
  },
  "Bungoma": {
    "Bungoma East": {
      "Bungoma East": ["Bungoma", "Kimilili", "Kanduyi"],
    },
  },
  "Busia": {
    "Busia": {
      "Busia": ["Busia", "Funyula", "Budalangi"],
    },
  },
  "Kakamega": {
    "Kakamega": {
      "Kakamega": ["Kakamega", "Mumias", "Lukulu"],
    },
  },
  "Vihiga": {
    "Vihiga": {
      "Vihiga": ["Vihiga", "Mbale", "Chaveta"],
    },
  },
  "Kisumu": {
    "Kisumu East": {
      "Kisumu East": ["Kisumu", "Ahero", "Muhoroni"],
    },
  },
  "Turkana": {
    "Turkana East": {
      "Turkana East": ["Turkana", "Kakuma", "Lokichar"],
    },
  },
  "West Pokot": {
    "West Pokot": {
      "West Pokot": ["West Pokot", "Kaptar", "Sook"],
    },
  },
  "Mandera": {
    "Mandera East": {
      "Mandera East": ["Mandera", "Wajir", "Lokichar"],
    },
  },
  "Wajir": {
    "Wajir North": {
      "Wajir North": ["Wajir", "Laghdera", "Tana River"],
    },
  },
  "Garissa": {
    "Garissa Town": {
      "Garissa Town": ["Garissa", "Dollo Ado", "Modika"],
    },
  },
  "Isiolo": {
    "Isiolo": {
      "Isiolo": ["Isiolo", "Garba Tula", "Oldonyo"],
    },
  },
  "Marsabit": {
    "Marsabit": {
      "Marsabit": ["Marsabit", "Karakuni", "Lodwar"],
    },
  },
  "Embu": {
    "Embu": {
      "Embu": ["Embu", "Runyenjes", "Manyatta"],
    },
  },
  "Kitui": {
    "Kitui": {
      "Kitui": ["Kitui", "Kibwezi", "Mwingi"],
    },
  },
  "Makueni": {
    "Makueni": {
      "Makueni": ["Makueni", "Wote", "Kibwezi"],
    },
  },
  "Tana River": {
    "Tana River": {
      "Tana River": ["Tana River", "Hola", "Garsen"],
    },
  },
  "Lamu": {
    "Lamu": {
      "Lamu": ["Lamu", "Mokowe", "Pangani"],
    },
  },
  "Taita/Taveta": {
    "Voi": {
      "Voi": ["Voi", "Mombasa Road", "Mara"],
    },
  },
  "Tharaka-Nithi": {
    "Tharaka-Nithi": {
      "Tharaka-Nithi": ["Tharaka", "Nithi", "Chuka"],
    },
  },
  "Nyamira": {
    "Nyamira": {
      "Nyamira": ["Nyamira", "Kitutu", "Bomachoch"],
    },
  },
  "Nandi": {
    "Nandi": {
      "Nandi": ["Nandi", "Kapsabet", "Cheptile"],
    },
  },
  "Kabarnet": {
    "Baringo": {
      "Baringo": ["Baringo", "Lake Bogoria", "Mogot"],
    },
  },
  "Laikipia": {
    "Laikipia": {
      "Laikipia": ["Laikipia", "Nyahururu", "Nanyuki"],
    },
  },
  "Narok": {
    "Narok": {
      "Narok": ["Narok", "Kilgoris", "Narok Town"],
    },
  },
  "Kajiado": {
    "Kajiado": {
      "Kajiado": ["Kajiado", "Kitengela", "Oloitiko"],
    },
  },
  "Shinyanga": {
    "Shinyanga": {
      "Shinyanga": ["Shinyanga", "Mwanza", "Kigoma"],
    },
  },
  "Kigoma": {
    "Kigoma": {
      "Kigoma": ["Kigoma", "Uvinza", "Kalundu"],
    },
  },
  "Katavi": {
    "Katavi": {
      "Katavi": ["Katavi", "Mpanda", "Sumban"],
    },
  },
  "Ruvuma": {
    "Ruvuma": {
      "Ruvuma": ["Ruvuma", "Mtwara", "Newala"],
    },
  },
  "Rungwe": {
    "Rungwe": {
      "Rungwe": ["Rungwe", "VVO", "Lukanisi"],
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
