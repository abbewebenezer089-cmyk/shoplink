// Countries with their WhatsApp dialling codes and the usual currency label.
// Sellers can always change the currency label in their profile.
window.SL = (function () {
  const list = [
    ['DZ','Algeria','213','DZD'],['AO','Angola','244','Kz'],['AR','Argentina','54','ARS'],['AU','Australia','61','A$'],
    ['BD','Bangladesh','880','৳'],['BE','Belgium','32','€'],['BJ','Benin','229','FCFA'],['BW','Botswana','267','P'],
    ['BR','Brazil','55','R$'],['BF','Burkina Faso','226','FCFA'],['CM','Cameroon','237','FCFA'],['CA','Canada','1','CA$'],
    ['CL','Chile','56','CLP'],['CN','China','86','¥'],['CO','Colombia','57','COP'],['CG','Congo','242','FCFA'],
    ['CD','DR Congo','243','FC'],['CI','Côte d’Ivoire','225','FCFA'],['DK','Denmark','45','kr'],['EG','Egypt','20','E£'],
    ['ET','Ethiopia','251','ETB'],['FR','France','33','€'],['GA','Gabon','241','FCFA'],['GM','Gambia','220','D'],
    ['DE','Germany','49','€'],['GH','Ghana','233','GH₵'],['GN','Guinea','224','GNF'],['HT','Haiti','509','HTG'],
    ['IN','India','91','₹'],['ID','Indonesia','62','Rp'],['IE','Ireland','353','€'],['IT','Italy','39','€'],
    ['JM','Jamaica','1','J$'],['JP','Japan','81','¥'],['KE','Kenya','254','KSh'],['KW','Kuwait','965','KWD'],
    ['LR','Liberia','231','L$'],['LY','Libya','218','LYD'],['MG','Madagascar','261','Ar'],['MW','Malawi','265','MK'],
    ['MY','Malaysia','60','RM'],['ML','Mali','223','FCFA'],['MR','Mauritania','222','MRU'],['MU','Mauritius','230','Rs'],
    ['MX','Mexico','52','MX$'],['MA','Morocco','212','MAD'],['MZ','Mozambique','258','MT'],['NA','Namibia','264','N$'],
    ['NP','Nepal','977','Rs'],['NL','Netherlands','31','€'],['NZ','New Zealand','64','NZ$'],['NE','Niger','227','FCFA'],
    ['NG','Nigeria','234','₦'],['NO','Norway','47','kr'],['PK','Pakistan','92','Rs'],['PE','Peru','51','S/'],
    ['PH','Philippines','63','₱'],['PL','Poland','48','zł'],['PT','Portugal','351','€'],['QA','Qatar','974','QAR'],
    ['RU','Russia','7','₽'],['RW','Rwanda','250','RWF'],['SA','Saudi Arabia','966','SAR'],['SN','Senegal','221','FCFA'],
    ['SL','Sierra Leone','232','Le'],['SG','Singapore','65','S$'],['SO','Somalia','252','SOS'],['ZA','South Africa','27','R'],
    ['KR','South Korea','82','₩'],['SS','South Sudan','211','SSP'],['ES','Spain','34','€'],['LK','Sri Lanka','94','Rs'],
    ['SD','Sudan','249','SDG'],['SE','Sweden','46','kr'],['CH','Switzerland','41','CHF'],['TZ','Tanzania','255','TSh'],
    ['TH','Thailand','66','฿'],['TG','Togo','228','FCFA'],['TT','Trinidad and Tobago','1','TT$'],['TN','Tunisia','216','TND'],
    ['TR','Türkiye','90','₺'],['UG','Uganda','256','USh'],['UA','Ukraine','380','₴'],['AE','United Arab Emirates','971','AED'],
    ['GB','United Kingdom','44','£'],['US','United States','1','$'],['VN','Vietnam','84','₫'],['ZM','Zambia','260','ZK'],
    ['ZW','Zimbabwe','263','USD']
  ];
  const countries = list.map(([iso, name, dial, cur]) => ({iso, name, dial, cur})).sort((a, b) => a.name.localeCompare(b.name));
  return {
    countries,
    byName: (n) => countries.find((c) => c.name === n) || null,
    byIso: (i) => countries.find((c) => c.iso === i) || null,
    // the country of the phone's language setting, for example en-GH gives GH
    guess() {
      const l = (navigator.languages && navigator.languages[0]) || navigator.language || '';
      const m = l.match(/[-_]([A-Za-z]{2})$/);
      return m ? m[1].toUpperCase() : '';
    },
    // full international number (digits only) from a country code and the number as typed
    join(dial, typed) {
      const raw = String(typed || '').trim();
      if (raw.startsWith('+')) return raw.replace(/\D/g, '');
      if (raw.startsWith('00')) return raw.replace(/\D/g, '').slice(2);
      return String(dial || '').replace(/\D/g, '') + raw.replace(/\D/g, '').replace(/^0+/, '');
    },
    // the part after the country code, for showing in a form
    split(full, dial) {
      const f = String(full || '').replace(/\D/g, ''), d = String(dial || '').replace(/\D/g, '');
      return d && f.startsWith(d) ? f.slice(d.length) : f;
    },
    optionsHtml(selected) {
      return '<option value="">Select your country</option>' +
        countries.map((c) => `<option value="${c.name}"${c.name === selected ? ' selected' : ''}>${c.name}</option>`).join('') +
        `<option value="Other"${selected === 'Other' ? ' selected' : ''}>Other country</option>`;
    }
  };
})();
