import { validCombinations } from './compatibility.ts'
import type { Class, Gender, Race } from '../types/character.ts'

export interface RaceNames {
  maleFirstNames: readonly string[]
  femaleFirstNames: readonly string[]
  surnames: readonly string[]
}

const classEpithets: Record<Class, readonly [string, string, string, string, string, string]> = {
  Warrior: ['Ironbound', 'Battleworn', 'Shieldbreaker', 'Warforged', 'Steelguard', 'Blademaster'],
  Paladin: ['Oathkeeper', 'Dawnwarden', 'Lightbringer', 'Sunshield', 'Truthbearer', 'Justicar'],
  Hunter: ['Farstrider', 'Beastfriend', 'Trueflight', 'Wildtracker', 'Hawkeye', 'Pathfinder'],
  Rogue: ['Shadowsworn', 'Quickblade', 'Veilrunner', 'Nightwhisper', 'Silentstep', 'Duskslicer'],
  Priest: ['Dawnprayer', 'Soulkeeper', 'Starwatcher', 'Lightweaver', 'Faithwarden', 'Kindler'],
  Mage: ['Spellweaver', 'Runecaller', 'Aetherwise', 'Spellbinder', 'Arcanist', 'Frostscribe'],
  Warlock: ['Felbound', 'Dreadcaller', 'Voidmarked', 'Soulreaper', 'Ashenpact', 'Hexbinder'],
  Shaman: ['Stormcaller', 'Earthspeaker', 'Totemwise', 'Flamekeeper', 'Spiritwalker', 'Tidebinder'],
  Druid: ['Wildwarden', 'Moonkeeper', 'Thornspeaker', 'Grovebound', 'Leafdancer', 'Dawnbloom'],
}

export const namesByRace: Record<Race, RaceNames> = {
  Human: {
    maleFirstNames: ['Aldren', 'Berric', 'Calven', 'Darian', 'Edric', 'Fenlow', 'Garran', 'Hadric', 'Iveron', 'Jorren', 'Kelric', 'Luthen', 'Merrick', 'Osmund', 'Tavian', 'Weylan', 'Alric', 'Corwin', 'Edran', 'Halden', 'Osric', 'Rowan', 'Theric', 'Valen'],
    femaleFirstNames: ['Aveline', 'Briony', 'Cerys', 'Delara', 'Elowen', 'Fiora', 'Gwyneth', 'Helene', 'Isolde', 'Jessamine', 'Liora', 'Mariel', 'Roslyn', 'Seren', 'Tamsin', 'Vianne', 'Annelise', 'Catrin', 'Elara', 'Linette', 'Mirelda', 'Nerissa', 'Oriana', 'Sylvie'],
    surnames: ['Ashcombe', 'Barrowmere', 'Bellweather', 'Brightward', 'Cinderford', 'Dawnridge', 'Elderbrook', 'Fairbourne', 'Fallowmere', 'Glenmarch', 'Hearthglen', 'Ironvale', 'Merewood', 'Northwatch', 'Thornfield', 'Westervale', 'Alderbrook', 'Brightmere', 'Crownhill', 'Goldhaven', 'Ravencrest', 'Silverford', 'Stonebridge', 'Whitestone'],
  },
  Dwarf: {
    maleFirstNames: ['Bromli', 'Durnek', 'Eldrik', 'Fjorn', 'Garrum', 'Haldor', 'Keldan', 'Marnok', 'Orsik', 'Rurik', 'Stenvar', 'Thorek', 'Uldren', 'Varnik', 'Wulfric', 'Yorven', 'Baldrek', 'Dornik', 'Eirik', 'Gorim', 'Kazrik', 'Morgran', 'Thrain', 'Vondal'],
    femaleFirstNames: ['Brynna', 'Dagni', 'Eirla', 'Frida', 'Gunnra', 'Hilda', 'Kelda', 'Marnie', 'Nivra', 'Orla', 'Ragna', 'Sigrun', 'Thyra', 'Una', 'Velda', 'Ylva', 'Astrid', 'Brunhild', 'Dagna', 'Freydis', 'Helja', 'Ingrid', 'Svala', 'Torunn'],
    surnames: ['Anvilbraid', 'Barrelmantle', 'Copperdelve', 'Deepcairn', 'Emberbeard', 'Flintgirdle', 'Granitehelm', 'Hammerfall', 'Ironroot', 'Kegwarden', 'Mithrilvein', 'Oakenshield', 'Runehammer', 'Stonebrow', 'Thunderslag', 'Wyrmforged', 'Alewarden', 'Bronzebeard', 'Forgeheart', 'Goldvein', 'Hearthstone', 'Oathanvil', 'Steelmantle', 'Thornhelm'],
  },
  'Night Elf': {
    maleFirstNames: ['Aelthir', 'Caelion', 'Daerun', 'Elaris', 'Faelor', 'Ithalen', 'Kaeloran', 'Letharion', 'Maevor', 'Nymaris', 'Oryndel', 'Saelrin', 'Thalorien', 'Vaelith', 'Ylloran', 'Zerathil', 'Aerendyl', 'Elandor', 'Ithorien', 'Kaelith', 'Loraeth', 'Nythalas', 'Saelthas', 'Vaerion'],
    femaleFirstNames: ['Aeloria', 'Caelira', 'Daelwen', 'Elyndra', 'Faelira', 'Ilythene', 'Kaeloria', 'Lunareth', 'Maerelle', 'Nymoria', 'Orelith', 'Saelune', 'Thalara', 'Vaelune', 'Yllaria', 'Zerelune', 'Aeriselle', 'Elarwyn', 'Ithilwen', 'Letharia', 'Maelwen', 'Nimriel', 'Saeloria', 'Vaelithra'],
    surnames: ['Boughwhisper', 'Duskpetal', 'Evershade', 'Fernwhisper', 'Gloamleaf', 'Lunarglen', 'Mistbough', 'Moonbriar', 'Nightsong Vale', 'Oakwoven', 'Silverfrond', 'Starbloom', 'Stardew', 'Thornlilt', 'Veilgrove', 'Willowgaze', 'Ashenbough', 'Dawnbloom', 'Fernshade', 'Glimmerleaf', 'Moonwillow', 'Nightpetal', 'Silverbranch', 'Whisperwind'],
  },
  Gnome: {
    maleFirstNames: ['Bixley', 'Coggle', 'Dibwick', 'Fennick', 'Glimber', 'Jexley', 'Kipwick', 'Miloq', 'Nimblet', 'Orrick', 'Pindle', 'Quillan', 'Razzik', 'Tinket', 'Vibble', 'Wizzle', 'Bramble', 'Cogwin', 'Dinket', 'Fizzwick', 'Jorble', 'Kettix', 'Poggle', 'Zibbin'],
    femaleFirstNames: ['Brelly', 'Cimble', 'Dazzia', 'Fizelle', 'Glimmi', 'Jinxia', 'Kettli', 'Merribell', 'Nixette', 'Orlina', 'Pipra', 'Quessa', 'Ribbli', 'Tazelle', 'Vexi', 'Winnet', 'Bimsy', 'Cogglea', 'Dibella', 'Fenneli', 'Jixie', 'Mimsy', 'Poppet', 'Tinkella'],
    surnames: ['Brassbutton', 'Cogspring', 'Coppercoil', 'Dapplegear', 'Flickerfuse', 'Gearwhistle', 'Joltspanner', 'Kettlewick', 'Lightlever', 'Merrysprocket', 'Nimblepin', 'Pennycrank', 'Quickweld', 'Rumblebolt', 'Tinkerthread', 'Wobbleworth', 'Boltwhistle', 'Brightgear', 'Clockspinner', 'Copperwink', 'Geargrin', 'Glimmerbolt', 'Sprocketwhirl', 'Whirligig'],
  },
  'High Order Skyborne': {
    maleFirstNames: ['Aurelion', 'Caelovar', 'Elarion', 'Ithovar', 'Lioren', 'Maelion', 'Neroval', 'Othariel', 'Quenorin', 'Saelovar', 'Thaelion', 'Vaereth', 'Ysilvar', 'Zaeloren', 'Orelion', 'Cyravel', 'Aethorin', 'Caelestis', 'Elarionel', 'Itheryn', 'Lumaeron', 'Orynthas', 'Vaelorian', 'Zylaren'],
    femaleFirstNames: ['Aureliah', 'Caeloria', 'Elarienne', 'Ithoria', 'Liorielle', 'Maelora', 'Neravelle', 'Othariel', 'Quenara', 'Saeloria', 'Thaelune', 'Vaerelle', 'Ysilene', 'Zaeloria', 'Orelune', 'Cyravelle', 'Aetherea', 'Caelienne', 'Elarielle', 'Ithilora', 'Lumaelle', 'Nerathiel', 'Vaeloria', 'Zyrelle'],
    surnames: ['Aethercrest', 'Brightaerie', 'Cloudmantle', 'Dawnspire', 'Eversky', 'Feathercrown', 'Highmere', 'Luminarch', 'Mistcrown', 'Opalwind', 'Radiantreach', 'Silversummit', 'Skylattice', 'Starward', 'Sunspire', 'Zephyrhallow', 'Aetherglen', 'Dawnfeather', 'Everbright', 'Goldensky', 'Highwatch', 'Lumenvale', 'Silvercloud', 'Starcrest'],
  },
  Orc: {
    maleFirstNames: ['Brakhar', 'Dorgash', 'Gromek', 'Hrukhan', 'Kargul', 'Mokran', 'Nargoth', 'Ogrash', 'Rukmar', 'Shargan', 'Thokar', 'Urzak', 'Vorgul', 'Wargan', 'Yurmak', 'Zogran', 'Brokkar', 'Drazgul', 'Gorvash', 'Krothar', 'Mugrak', 'Rendak', 'Thurgash', 'Zargrim'],
    femaleFirstNames: ['Borga', 'Drakka', 'Gorza', 'Hrukka', 'Kargra', 'Morga', 'Nazhka', 'Ruksha', 'Sharga', 'Thorga', 'Urzha', 'Varka', 'Wazra', 'Yagra', 'Zarka', 'Brukka', 'Dorga', 'Ghazra', 'Krosha', 'Mokara', 'Narga', 'Rukha', 'Thrakka', 'Zugra'],
    surnames: ['Ashmaul', 'Blacktusk', 'Bonebreaker', 'Cragfist', 'Dreadmaw', 'Grimscar', 'Ironhowl', 'Ragecleaver', 'Redsunder', 'Roughhide', 'Skullforge', 'Stonehowl', 'Stormchaser', 'Thundertusk', 'Wargrinder', 'Wolfcrag', 'Bloodmaul', 'Crushbone', 'Doomfist', 'Grimtotem', 'Ragefang', 'Skullcrusher', 'Steeljaw', 'Warhowl'],
  },
  Undead: {
    maleFirstNames: ['Aldous', 'Corvin', 'Demeric', 'Edras', 'Faustus', 'Gideon', 'Luceran', 'Malver', 'Odran', 'Percival', 'Sevrin', 'Theronel', 'Ulric', 'Vespern', 'Wystan', 'Yorick', 'Alistair', 'Bastian', 'Cyran', 'Dorian', 'Edmund', 'Lucien', 'Silas', 'Valerian'],
    femaleFirstNames: ['Adelise', 'Cressida', 'Damaris', 'Evelisse', 'Faneva', 'Ghislaine', 'Lenora', 'Mirelle', 'Odelia', 'Peressa', 'Sabine', 'Sybella', 'Violetta', 'Wrenna', 'Ysabet', 'Zelene', 'Amaranth', 'Beatrix', 'Cordelia', 'Isabeau', 'Lavinia', 'Rosamund', 'Theodora', 'Vivienne'],
    surnames: ['Ashenhall', 'Blackmere', 'Crowswick', 'Dreadwell', 'Duskhollow', 'Gravesend', 'Gloamfield', 'Harrowfen', 'Mourningvale', 'Palegrave', 'Ravenshade', 'Sablewick', 'Thorncrypt', 'Umberleigh', 'Vellgrave', 'Wraithmoor', 'Blackthorn', 'Crowhurst', 'Duskford', 'Grimwold', 'Hollowmere', 'Mournfield', 'Ravenholt', 'Shadegrave'],
  },
  Tauren: {
    maleFirstNames: ['Ahanoru', 'Bramatok', 'Chalun', 'Dorakai', 'Ehanu', 'Hokaru', 'Ishano', 'Koruha', 'Makanu', 'Noharu', 'Orunai', 'Pahana', 'Rohaku', 'Tavanu', 'Waheno', 'Yoraku', 'Akeche', 'Chayton', 'Elanahi', 'Kohana', 'Matoaka', 'Nokosi', 'Takoda', 'Wahkan'],
    femaleFirstNames: ['Aponi', 'Chayena', 'Elaruna', 'Hinawe', 'Kahena', 'Mahina', 'Nayeli', 'Ohania', 'Pahana', 'Runawe', 'Sahena', 'Taluna', 'Wenara', 'Yunali', 'Zahina', 'Miyana', 'Aiyana', 'Enola', 'Kanti', 'Mikaela', 'Nita', 'Sakari', 'Tala', 'Winona'],
    surnames: ['Ambergrass', 'Cloudstepper', 'Dawnmeadow', 'Earthsong', 'Farwalker', 'Greensky', 'Highprairie', 'Mistrunner', 'Oakantler', 'Raincaller', 'Redclover', 'Softwind', 'Starhoof', 'Sunmeadow', 'Thunderbloom', 'Wildroot', 'Autumnhorn', 'Brightmeadow', 'Earthwalker', 'Goldenhide', 'Longstride', 'Riverhoof', 'Stormgrazer', 'Wildmane'],
  },
  Troll: {
    maleFirstNames: ['Arazko', 'Bokari', 'Dazuru', 'Gorvani', 'Jazeko', 'Kashari', 'Lazuko', 'Mokari', 'Nabazu', 'Razeko', 'Shavari', 'Tazuko', 'Vokari', 'Wazuru', 'Yazeko', 'Zorvani', 'Azekan', 'Brizko', 'Dralani', 'Ghazuko', 'Jorvani', 'Krazeko', 'Mabari', 'Zanvazu'],
    femaleFirstNames: ['Azari', 'Brelza', 'Dazani', 'Ghazira', 'Jazari', 'Kezani', 'Lazira', 'Mazari', 'Nizani', 'Razira', 'Shazani', 'Tazira', 'Vezani', 'Wazira', 'Yazani', 'Zezira', 'Azeka', 'Brazani', 'Dazira', 'Ghazani', 'Jezira', 'Kezara', 'Mazira', 'Zanari'],
    surnames: ['Bramblefang', 'Drumsunder', 'Echobite', 'Fangbloom', 'Gloomtide', 'Jadeclaw', 'Krakensong', 'Mirefang', 'Nightchant', 'Razorvine', 'Reedstalker', 'Scarletmarsh', 'Spiritscale', 'Thornchant', 'Vinecaller', 'Wildtide', 'Bloodreed', 'Dusktide', 'Fangrunner', 'Jadebloom', 'Marshsong', 'Redscale', 'Spiritspear', 'Thornfang'],
  },
  'Windshaper Skyborne': {
    maleFirstNames: ['Aruvak', 'Borekan', 'Cyrukai', 'Dovaran', 'Eshukar', 'Feyrukan', 'Galevar', 'Heshuran', 'Iruvath', 'Kaivoran', 'Mistrakai', 'Oruvane', 'Ravukar', 'Sirovath', 'Tavurek', 'Veyrukan', 'Areshan', 'Cyravan', 'Darevuk', 'Galevran', 'Ishurak', 'Kaiveth', 'Ravethan', 'Zoruvan'],
    femaleFirstNames: ['Aruvani', 'Borelia', 'Cyrukai', 'Dovara', 'Eshura', 'Feyruna', 'Galeira', 'Heshura', 'Iruvani', 'Kaivora', 'Mistrali', 'Oruvani', 'Ravura', 'Sirovani', 'Tavura', 'Veyrali', 'Arelia', 'Cyravani', 'Darelia', 'Eshari', 'Galevra', 'Ishara', 'Ravalia', 'Zorali'],
    surnames: ['Ashenbreeze', 'Cloudrider', 'Dustwhirl', 'Farwind', 'Galeweaver', 'Highcurrent', 'Mistwalker', 'Rainwhorl', 'Ridgewind', 'Sandstormer', 'Skybreaker', 'Stormrill', 'Sunwind', 'Thunderwake', 'Windriven', 'Zephyrclaw', 'Cloudwhisper', 'Dawncurrent', 'Farstrider', 'Gustcaller', 'Highwind', 'Mistcrest', 'Stormflight', 'Windwatcher'],
  },
}

// Every valid race/class pair gets a small race-rooted surname pool.
export const classSurnamesByCombination = Object.fromEntries(
  validCombinations.map(({ race, class: characterClass }) => [
    `${race}|${characterClass}`,
    classEpithets[characterClass].map((epithet, index) => `${namesByRace[race].surnames[index]} ${epithet}`),
  ]),
) as Record<string, readonly string[]>

export function getFirstNamePool(race: Race, gender: Gender): readonly string[] {
  return gender === 'Male' ? namesByRace[race].maleFirstNames : namesByRace[race].femaleFirstNames
}
