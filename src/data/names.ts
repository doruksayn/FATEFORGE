import type { Gender, Race } from '../types/character.ts'

export interface RaceNames {
  maleFirstNames: readonly string[]
  femaleFirstNames: readonly string[]
  surnames: readonly string[]
}

export const namesByRace: Record<Race, RaceNames> = {
  Human: {
    maleFirstNames: ['Aldren', 'Berric', 'Calven', 'Darian', 'Edric', 'Fenlow', 'Garran', 'Hadric', 'Iveron', 'Jorren', 'Kelric', 'Luthen', 'Merrick', 'Osmund', 'Tavian', 'Weylan'],
    femaleFirstNames: ['Aveline', 'Briony', 'Cerys', 'Delara', 'Elowen', 'Fiora', 'Gwyneth', 'Helene', 'Isolde', 'Jessamine', 'Liora', 'Mariel', 'Roslyn', 'Seren', 'Tamsin', 'Vianne'],
    surnames: ['Ashcombe', 'Barrowmere', 'Bellweather', 'Brightward', 'Cinderford', 'Dawnridge', 'Elderbrook', 'Fairbourne', 'Fallowmere', 'Glenmarch', 'Hearthglen', 'Ironvale', 'Merewood', 'Northwatch', 'Thornfield', 'Westervale'],
  },
  Dwarf: {
    maleFirstNames: ['Bromli', 'Durnek', 'Eldrik', 'Fjorn', 'Garrum', 'Haldor', 'Keldan', 'Marnok', 'Orsik', 'Rurik', 'Stenvar', 'Thorek', 'Uldren', 'Varnik', 'Wulfric', 'Yorven'],
    femaleFirstNames: ['Brynna', 'Dagni', 'Eirla', 'Frida', 'Gunnra', 'Hilda', 'Kelda', 'Marnie', 'Nivra', 'Orla', 'Ragna', 'Sigrun', 'Thyra', 'Una', 'Velda', 'Ylva'],
    surnames: ['Anvilbraid', 'Barrelmantle', 'Copperdelve', 'Deepcairn', 'Emberbeard', 'Flintgirdle', 'Granitehelm', 'Hammerfall', 'Ironroot', 'Kegwarden', 'Mithrilvein', 'Oakenshield', 'Runehammer', 'Stonebrow', 'Thunderslag', 'Wyrmforged'],
  },
  'Night Elf': {
    maleFirstNames: ['Aelthir', 'Caelion', 'Daerun', 'Elaris', 'Faelor', 'Ithalen', 'Kaeloran', 'Letharion', 'Maevor', 'Nymaris', 'Oryndel', 'Saelrin', 'Thalorien', 'Vaelith', 'Ylloran', 'Zerathil'],
    femaleFirstNames: ['Aeloria', 'Caelira', 'Daelwen', 'Elyndra', 'Faelira', 'Ilythene', 'Kaeloria', 'Lunareth', 'Maerelle', 'Nymoria', 'Orelith', 'Saelune', 'Thalara', 'Vaelune', 'Yllaria', 'Zerelune'],
    surnames: ['Boughwhisper', 'Duskpetal', 'Evershade', 'Fernwhisper', 'Gloamleaf', 'Lunarglen', 'Mistbough', 'Moonbriar', 'Nightsong Vale', 'Oakwoven', 'Silverfrond', 'Starbloom', 'Stardew', 'Thornlilt', 'Veilgrove', 'Willowgaze'],
  },
  Gnome: {
    maleFirstNames: ['Bixley', 'Coggle', 'Dibwick', 'Fennick', 'Glimber', 'Jexley', 'Kipwick', 'Miloq', 'Nimblet', 'Orrick', 'Pindle', 'Quillan', 'Razzik', 'Tinket', 'Vibble', 'Wizzle'],
    femaleFirstNames: ['Brelly', 'Cimble', 'Dazzia', 'Fizelle', 'Glimmi', 'Jinxia', 'Kettli', 'Merribell', 'Nixette', 'Orlina', 'Pipra', 'Quessa', 'Ribbli', 'Tazelle', 'Vexi', 'Winnet'],
    surnames: ['Brassbutton', 'Cogspring', 'Coppercoil', 'Dapplegear', 'Flickerfuse', 'Gearwhistle', 'Joltspanner', 'Kettlewick', 'Lightlever', 'Merrysprocket', 'Nimblepin', 'Pennycrank', 'Quickweld', 'Rumblebolt', 'Tinkerthread', 'Wobbleworth'],
  },
  'High Order Skyborne': {
    maleFirstNames: ['Aurelion', 'Caelovar', 'Elarion', 'Ithovar', 'Lioren', 'Maelion', 'Neroval', 'Othariel', 'Quenorin', 'Saelovar', 'Thaelion', 'Vaereth', 'Ysilvar', 'Zaeloren', 'Orelion', 'Cyravel'],
    femaleFirstNames: ['Aureliah', 'Caeloria', 'Elarienne', 'Ithoria', 'Liorielle', 'Maelora', 'Neravelle', 'Othariel', 'Quenara', 'Saeloria', 'Thaelune', 'Vaerelle', 'Ysilene', 'Zaeloria', 'Orelune', 'Cyravelle'],
    surnames: ['Aethercrest', 'Brightaerie', 'Cloudmantle', 'Dawnspire', 'Eversky', 'Feathercrown', 'Highmere', 'Luminarch', 'Mistcrown', 'Opalwind', 'Radiantreach', 'Silversummit', 'Skylattice', 'Starward', 'Sunspire', 'Zephyrhallow'],
  },
  Orc: {
    maleFirstNames: ['Brakhar', 'Dorgash', 'Gromek', 'Hrukhan', 'Kargul', 'Mokran', 'Nargoth', 'Ogrash', 'Rukmar', 'Shargan', 'Thokar', 'Urzak', 'Vorgul', 'Wargan', 'Yurmak', 'Zogran'],
    femaleFirstNames: ['Borga', 'Drakka', 'Gorza', 'Hrukka', 'Kargra', 'Morga', 'Nazhka', 'Ruksha', 'Sharga', 'Thorga', 'Urzha', 'Varka', 'Wazra', 'Yagra', 'Zarka', 'Brukka'],
    surnames: ['Ashmaul', 'Blacktusk', 'Bonebreaker', 'Cragfist', 'Dreadmaw', 'Grimscar', 'Ironhowl', 'Ragecleaver', 'Redsunder', 'Roughhide', 'Skullforge', 'Stonehowl', 'Stormchaser', 'Thundertusk', 'Wargrinder', 'Wolfcrag'],
  },
  Undead: {
    maleFirstNames: ['Aldous', 'Corvin', 'Demeric', 'Edras', 'Faustus', 'Gideon', 'Luceran', 'Malver', 'Odran', 'Percival', 'Sevrin', 'Theronel', 'Ulric', 'Vespern', 'Wystan', 'Yorick'],
    femaleFirstNames: ['Adelise', 'Cressida', 'Damaris', 'Evelisse', 'Faneva', 'Ghislaine', 'Lenora', 'Mirelle', 'Odelia', 'Peressa', 'Sabine', 'Sybella', 'Violetta', 'Wrenna', 'Ysabet', 'Zelene'],
    surnames: ['Ashenhall', 'Blackmere', 'Crowswick', 'Dreadwell', 'Duskhollow', 'Gravesend', 'Gloamfield', 'Harrowfen', 'Mourningvale', 'Palegrave', 'Ravenshade', 'Sablewick', 'Thorncrypt', 'Umberleigh', 'Vellgrave', 'Wraithmoor'],
  },
  Tauren: {
    maleFirstNames: ['Ahanoru', 'Bramatok', 'Chalun', 'Dorakai', 'Ehanu', 'Hokaru', 'Ishano', 'Koruha', 'Makanu', 'Noharu', 'Orunai', 'Pahana', 'Rohaku', 'Tavanu', 'Waheno', 'Yoraku'],
    femaleFirstNames: ['Aponi', 'Chayena', 'Elaruna', 'Hinawe', 'Kahena', 'Mahina', 'Nayeli', 'Ohania', 'Pahana', 'Runawe', 'Sahena', 'Taluna', 'Wenara', 'Yunali', 'Zahina', 'Miyana'],
    surnames: ['Ambergrass', 'Cloudstepper', 'Dawnmeadow', 'Earthsong', 'Farwalker', 'Greensky', 'Highprairie', 'Mistrunner', 'Oakantler', 'Raincaller', 'Redclover', 'Softwind', 'Starhoof', 'Sunmeadow', 'Thunderbloom', 'Wildroot'],
  },
  Troll: {
    maleFirstNames: ['Arazko', 'Bokari', 'Dazuru', 'Gorvani', 'Jazeko', 'Kashari', 'Lazuko', 'Mokari', 'Nabazu', 'Razeko', 'Shavari', 'Tazuko', 'Vokari', 'Wazuru', 'Yazeko', 'Zorvani'],
    femaleFirstNames: ['Azari', 'Brelza', 'Dazani', 'Ghazira', 'Jazari', 'Kezani', 'Lazira', 'Mazari', 'Nizani', 'Razira', 'Shazani', 'Tazira', 'Vezani', 'Wazira', 'Yazani', 'Zezira'],
    surnames: ['Bramblefang', 'Drumsunder', 'Echobite', 'Fangbloom', 'Gloomtide', 'Jadeclaw', 'Krakensong', 'Mirefang', 'Nightchant', 'Razorvine', 'Reedstalker', 'Scarletmarsh', 'Spiritscale', 'Thornchant', 'Vinecaller', 'Wildtide'],
  },
  'Windshaper Skyborne': {
    maleFirstNames: ['Aruvak', 'Borekan', 'Cyrukai', 'Dovaran', 'Eshukar', 'Feyrukan', 'Galevar', 'Heshuran', 'Iruvath', 'Kaivoran', 'Mistrakai', 'Oruvane', 'Ravukar', 'Sirovath', 'Tavurek', 'Veyrukan'],
    femaleFirstNames: ['Aruvani', 'Borelia', 'Cyrukai', 'Dovara', 'Eshura', 'Feyruna', 'Galeira', 'Heshura', 'Iruvani', 'Kaivora', 'Mistrali', 'Oruvani', 'Ravura', 'Sirovani', 'Tavura', 'Veyrali'],
    surnames: ['Ashenbreeze', 'Cloudrider', 'Dustwhirl', 'Farwind', 'Galeweaver', 'Highcurrent', 'Mistwalker', 'Rainwhorl', 'Ridgewind', 'Sandstormer', 'Skybreaker', 'Stormrill', 'Sunwind', 'Thunderwake', 'Windriven', 'Zephyrclaw'],
  },
}

export function getFirstNamePool(race: Race, gender: Gender): readonly string[] {
  return gender === 'Male' ? namesByRace[race].maleFirstNames : namesByRace[race].femaleFirstNames
}
