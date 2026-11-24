import type { GlossaryCategory, GlossaryEntry } from '../types/glossary';

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  '세력·조직',
  '무공·경지',
  '지리·강호',
  '인물·호칭',
];

export const GLOSSARY_CATEGORY_META: Record<
  GlossaryCategory,
  { color: string; bg: string }
> = {
  '세력·조직': { color: '#1e625b', bg: 'rgba(30,98,91,0.14)' },
  '무공·경지': { color: '#a62b21', bg: 'rgba(166,43,33,0.14)' },
  '지리·강호': { color: '#2b5b84', bg: 'rgba(43,91,132,0.14)' },
  '인물·호칭': { color: '#8a5a19', bg: 'rgba(138,90,25,0.15)' },
};

export const MURIM_GLOSSARY: GlossaryEntry[] = [
  // 세력·조직
  {
    id: 'gupailbang',
    term: '구파일방',
    hanja: '九派一幇',
    category: '세력·조직',
    summary: '정파 무림을 대표하는 아홉 문파와 하나의 방파(개방)',
    description:
      '소림사·무당파·화산파·종남파·아미파·공동파·점창파·곤륜파·청성파(작품에 따라 해남파 등 변주)의 9개 명문 정파와 천하 제일 정보조직인 개방(一幇)을 통칭합니다. 중원 정파의 핵심 기둥 역할을 합니다.',
    relatedIds: ['jeongpa', 'odaesega', 'murimmaeng', 'chongta'],
    aliases: ['구파일방(일방)'],
  },
  {
    id: 'odaesega',
    term: '오대세가',
    hanja: '五大世家',
    category: '세력·조직',
    summary: '혈연과 가문을 중심으로 무공을 전승하는 다섯 명문 세가',
    description:
      '남궁세가·사천당가·하북팽가·제갈세가·모용세가(또는 황보세가) 등 혈통을 중심으로 가전 무공과 막대한 재력을 대대로 이어가는 다섯 대가문입니다. 구파일방과 함께 정파 무림의 양대 축을 이룹니다.',
    relatedIds: ['gupailbang', 'jeongpa', 'gaju', 'amgi'],
  },
  {
    id: 'jeongpa',
    term: '정파',
    hanja: '正派',
    category: '세력·조직',
    summary: '협의와 도의를 중시하는 중원의 주류 무림 세력',
    description:
      '유·불·도의 윤리와 협객 정신을 표방하며 무림의 질서를 수호하는 문파들의 연합입니다. 구파일방과 오대세가가 중심이 되며, 위기 시 무림맹을 결성해 사파나 마교에 맞섭니다.',
    relatedIds: ['gupailbang', 'odaesega', 'sapa', 'magyo', 'murimmaeng'],
  },
  {
    id: 'sapa',
    term: '사파',
    hanja: '邪派',
    category: '세력·조직',
    summary: '정파의 규율에 얽매이지 않고 실리와 힘을 중시하는 흑도 세력',
    description:
      '관부나 정파의 도덕적 틀에서 벗어나 약육강식과 실리를 추구하는 무림 세력입니다. 장강수로채, 녹림칠십이채, 하오문 등이 대표적이며, 정파와 대립하면서도 마교의 침공 시에는 일시 연합하기도 합니다.',
    relatedIds: ['jeongpa', 'magyo', 'gangho'],
    aliases: ['사파 연합', '흑도'],
  },
  {
    id: 'magyo',
    term: '마교',
    hanja: '魔敎',
    category: '세력·조직',
    summary: '천마를 숭배하며 서역·십만대산에 본산을 둔 절대 마도 교단',
    description:
      '정식 명칭은 주로 천마신교(天魔神敎)로 묘사되며, 극한의 힘과 천마(天魔)에 대한 절대 복종을 교리로 삼습니다. 서역 천산이나 십만대산에 본산을 두고 중원 정벌을 노리는 최강의 적대 세력으로 자주 등장합니다.',
    relatedIds: ['cheonmasingong', 'seoyeok', 'sipmandaesan', 'gyoju'],
    aliases: ['마교 본산', '마도'],
  },
  {
    id: 'saeoeogung',
    term: '새외오궁',
    hanja: '塞外五宮',
    category: '세력·조직',
    summary: '중원 바깥(새외)의 변방에 자리한 다섯 강대 궁(宮) 세력',
    description:
      '북해빙궁, 남만야수궁, 포달랍궁, 남해태양궁, 서역(또는 막북)의 궁 세력 등 중원의 경계 너머에 독자적 무학 체계를 구축한 다섯 거대 문파를 뜻합니다.',
    relatedIds: ['saeoe', 'bingbaeksingong', 'jungwon'],
  },
  {
    id: 'murimmaeng',
    term: '무림맹',
    hanja: '武林盟',
    category: '세력·조직',
    summary: '정파 문파들이 공동 대응을 위해 결성한 최고 연합 기구',
    description:
      '마교의 침공이나 강호 대전란처럼 단일 문파가 감당하기 어려운 위기 때 정파 문파들이 뜻을 모아 세우는 연합체입니다. 맹주와 제갈세가 같은 참모진이 전략을 총괄합니다.',
    relatedIds: ['jeongpa', 'gupailbang', 'odaesega'],
  },
  {
    id: 'pyoguk',
    term: '표국',
    hanja: '鏢局',
    category: '세력·조직',
    summary: '무인들이 화물과 인물을 호송하는 강호의 전문 운송·경호 조직',
    description:
      '상단의 귀중한 화물이나 요인을 산적·사파의 습격으로부터 지키며 목적지까지 안전하게 운반하는 조직입니다. 표두(鏢頭)와 표사(鏢師)들이 마차 행렬을 호위하며 하루 약 50km 내외를 이동합니다.',
    relatedIds: ['gwando', 'gangho', 'sapa'],
  },
  {
    id: 'chongta',
    term: '총타',
    hanja: '總舵',
    category: '세력·조직',
    summary: '개방이나 대형 방파의 본부(본산)',
    description:
      '전국 각지에 흩어진 분타(分舵)를 통솔하는 방파의 최고 본부입니다. 개방의 경우 교통과 정보의 중심지인 하남성 개봉이나 낙양 일대에 총타를 두는 설정이 흔합니다.',
    relatedIds: ['gupailbang', 'bunta'],
  },
  {
    id: 'bunta',
    term: '분타',
    hanja: '分舵',
    category: '세력·조직',
    summary: '대형 방파가 각 지역에 설치한 지부 거점',
    description:
      '총타의 지휘 아래 각 성(省)과 주요 도시에 배치되어 정보 수집, 연락망 유지, 지역 관할을 담당하는 하부 거점입니다.',
    relatedIds: ['chongta', 'gupailbang'],
  },

  // 무공·경지
  {
    id: 'naegong',
    term: '내공',
    hanja: '內功',
    category: '무공·경지',
    summary: '단전에 진기를 축적하고 운용하는 내면 수련 무학',
    description:
      '호흡법(토납법)과 심법을 통해 체내 단전에 진기(내력)를 쌓아 올리는 무공의 근간입니다. 내공이 깊을수록 초식의 위력, 경공의 속도, 회복력이 비약적으로 상승합니다.',
    relatedIds: ['oegong', 'gyeonggong', 'jeoljeong', 'yeokgeungyeong'],
  },
  {
    id: 'oegong',
    term: '외공',
    hanja: '外功',
    category: '무공·경지',
    summary: '신체의 근골과 피부, 무기술을 단련하는 외면적 무학',
    description:
      '권각·병장기 초식과 신체 단련(금종조·철포삼 등)을 통해 육체 자체의 강인함과 파괴력을 극대화하는 수련법입니다.',
    relatedIds: ['naegong', 'gyeonggong'],
  },
  {
    id: 'gyeonggong',
    term: '경공',
    hanja: '輕功',
    category: '무공·경지',
    summary: '내공으로 몸을 가볍게 하여 고속 이동·도약하는 신법 무공',
    description:
      '발끝에 진기를 실어 지면을 박차고 날듯이 달리는 이동술입니다. 절정 고수가 전력을 다해 경공을 펼치면 하루에 200km(500리) 이상을 주파하는 것으로 묘사됩니다.',
    relatedIds: ['naegong', 'jeoljeong', 'ri'],
    aliases: ['절정 경공'],
  },
  {
    id: 'jeoljeong',
    term: '절정',
    hanja: '絶頂',
    category: '무공·경지',
    summary: '강호에서 일류 고수를 넘어 한 문파를 대표할 수 있는 상위 경지',
    description:
      '삼류–이류–일류를 넘어 검기(劍氣)를 자유자재로 운용하고 호신강기를 펼칠 수 있는 경지입니다. 이 위로 초절정, 화경(化境), 현경(玄境) 등의 초월적 경지가 이어집니다.',
    relatedIds: ['hwagyeong', 'naegong', 'gyeonggong', 'gosu'],
  },
  {
    id: 'hwagyeong',
    term: '화경',
    hanja: '化境',
    category: '무공·경지',
    summary: '무공이 자연의 이치와 조화를 이루는 최상위 고수의 경지',
    description:
      '절정과 초절정을 넘어선 대종사의 반열로, 검강(劍罡)을 다루고 사소한 동작 하나에도 천지의 기운을 실을 수 있는 경지입니다.',
    relatedIds: ['jeoljeong', 'naegong', 'gosu'],
  },
  {
    id: 'yeokgeungyeong',
    term: '역근경',
    hanja: '易筋經',
    category: '무공·경지',
    summary: '소림사 최고 비전으로 전해지는 불가 제일의 내공심법',
    description:
      '달마대사가 남겼다고 전해지는 소림사 진파(鎭派) 절기입니다. 근육과 경맥을 탈태환골하듯 바꾸어 탁월한 정통 내력을 길러줍니다.',
    relatedIds: ['naegong', 'gupailbang'],
  },
  {
    id: 'taegeukgwon',
    term: '태극권',
    hanja: '太極拳',
    category: '무공·경지',
    summary: '부드러움으로 강함을 제압하는 무당파의 대표 도가 권법',
    description:
      '이유극강(以柔克剛)과 차력타력의 원리를 담아 상대의 힘을 흘려보내고 되돌려 주는 무당파의 상징적 무공입니다. 태극검법과 함께 도가 무학의 정수로 꼽힙니다.',
    relatedIds: ['naegong', 'gupailbang'],
    aliases: ['태극검법', '태극 무학'],
  },
  {
    id: 'maehwageombeop',
    term: '이십사수매화검법',
    hanja: '二十四手梅花劍法',
    category: '무공·경지',
    summary: '만개한 매화처럼 화려하고 변화무쌍한 화산파의 대표 검법',
    description:
      '검끝에서 매화 꽃잎이 흩날리는 듯한 환영(검화)을 피워내어 상대를 현혹하고 급소를 찌르는 화산파 제일의 검술입니다. 자하신공과 어우러질 때 극한의 위력을 발휘합니다.',
    relatedIds: ['jahasingong', 'gupailbang'],
  },
  {
    id: 'jahasingong',
    term: '자하신공',
    hanja: '紫霞神功',
    category: '무공·경지',
    summary: '아침 붉은 노을의 기운을 품은 화산파 최고 내공심법',
    description:
      '화산파의 근간이 되는 정통 도가 심법으로, 운공 시 얼굴에 은은한 자줏빛 기운이 감돌며 깊고 순수한 진기를 길러 매화검법의 위력을 배가시킵니다.',
    relatedIds: ['maehwageombeop', 'naegong'],
  },
  {
    id: 'mancheonhwau',
    term: '만천화우',
    hanja: '滿天花雨',
    category: '무공·경지',
    summary: '하늘 가득 꽃비가 쏟아지듯 암기를 퍼붓는 사천당가의 절기',
    description:
      '사천당가 최고의 암기 수법으로, 수십~수백 개의 독침과 비침을 사각지대 없이 동시에 투척해 피할 곳을 봉쇄하는 치명적 무공입니다.',
    relatedIds: ['amgi', 'dokgong', 'odaesega'],
  },
  {
    id: 'amgi',
    term: '암기',
    hanja: '暗器',
    category: '무공·경지',
    summary: '몸에 숨겨 기습적으로 투척하는 소형 병기',
    description:
      '비도, 표창, 독침, 철련자 등 은밀하게 지니고 다니다가 원거리에서 상대를 제압하는 무기 체계입니다. 사천당가가 천하 제일의 암기 명가로 손꼽힙니다.',
    relatedIds: ['mancheonhwau', 'dokgong', 'odaesega'],
  },
  {
    id: 'dokgong',
    term: '독공',
    hanja: '毒功',
    category: '무공·경지',
    summary: '독을 내공이나 암기에 결합해 운용하는 특수 무학',
    description:
      '천하의 기독(奇毒)을 제련·운용하고 해독하는 무공 체계입니다. 사천당가와 남만·사파 계열에서 발달했으며, 내공이 깊은 고수도 방심하면 치명상을 입습니다.',
    relatedIds: ['amgi', 'mancheonhwau', 'sapa'],
    aliases: ['독술'],
  },
  {
    id: 'hangryong',
    term: '항룡십팔장',
    hanja: '降龍十八掌',
    category: '무공·경지',
    summary: '강맹한 패기로 용을 항복시키는 개방의 최고 장법',
    description:
      '타구봉법과 함께 개방을 상징하는 지강지맹(至剛至猛)의 장법입니다. 단순하면서도 파괴적인 18초식으로 정파 외공·장법의 정점으로 불립니다.',
    relatedIds: ['gupailbang', 'chongta'],
    aliases: ['타구봉법'],
  },
  {
    id: 'jinbeop',
    term: '진법',
    hanja: '陣法',
    category: '무공·경지',
    summary: '지형·방위·기관을 조합해 적을 가두거나 전력을 극대화하는 병법',
    description:
      '음양오행과 팔괘의 이치에 따라 다수의 무인이나 기관장치를 배치해 소수로 대군을 막아내는 전술 체계입니다. 제갈세가가 기관진법과 팔괘진의 대가로 꼽힙니다.',
    relatedIds: ['odaesega', 'murimmaeng'],
    aliases: ['기관진법', '팔괘진'],
  },
  {
    id: 'cheonmasingong',
    term: '천마신공',
    hanja: '天魔神功',
    category: '무공·경지',
    summary: '천마신교 역대 교주에게만 전승되는 마도 제일의 절세 신공',
    description:
      '천마의 패도와 파괴력을 담은 마교 최고 무학으로, 중원 정파의 모든 무공을 압도하는 절대적 위력을 지닌 것으로 묘사됩니다.',
    relatedIds: ['magyo', 'gyoju', 'naegong'],
  },
  {
    id: 'bingbaeksingong',
    term: '빙백신공',
    hanja: '氷魄神功',
    category: '무공·경지',
    summary: '극북의 한기를 내공으로 승화시킨 북해빙궁의 대표 신공',
    description:
      '차가운 한빙 진기를 운용해 상대의 혈맥과 병장기를 얼려버리는 지음(至陰) 계열의 새외 절기입니다. 남해태양궁의 지양 무공과 극적인 대비를 이룹니다.',
    relatedIds: ['saeoeogung', 'saeoe', 'naegong'],
    aliases: ['한빙장', '한빙 내공'],
  },

  // 지리·강호
  {
    id: 'gangho',
    term: '강호',
    hanja: '江湖',
    category: '지리·강호',
    summary: '관부의 통치 너머 무인들이 협의와 은원으로 살아가는 무림 세계',
    description:
      '원래는 장강(양자강)과 동정호·태호 등의 호수를 뜻했으나, 무협에서는 무림인들이 문파를 세우고 비무와 은원을 나누며 살아가는 독자적인 사회 공간을 의미합니다.',
    relatedIds: ['jungwon', 'saeoe', 'hyeopgaek'],
  },
  {
    id: 'jungwon',
    term: '중원',
    hanja: '中原',
    category: '지리·강호',
    summary: '황하 중하류와 장강 일대를 아우르는 중국 본토 핵심 무림 무대',
    description:
      '하남·섬서·호북·사천·안휘·강남 등 구파일방과 오대세가가 터전을 잡은 중화 본토를 가리킵니다. 무협소설의 주된 사건과 무림대회가 펼쳐지는 중심 무대입니다.',
    relatedIds: ['gangho', 'saeoe', 'gupailbang', 'odaesega'],
  },
  {
    id: 'saeoe',
    term: '새외',
    hanja: '塞外',
    category: '지리·강호',
    summary: '만리장성과 중원 변방 너머의 이역(異域) 무림 지대',
    description:
      '중원의 경계를 벗어난 북방 초원·바이칼(북해), 티베트(서장), 운남 남만, 남해 도서, 서역 등을 아우르는 외곽 지대입니다. 독자적인 새외오궁 세력이 군림합니다.',
    relatedIds: ['saeoeogung', 'seoyeok', 'jungwon'],
    aliases: ['새외무림'],
  },
  {
    id: 'seoyeok',
    term: '서역',
    hanja: '西域',
    category: '지리·강호',
    summary: '감숙성 옥문관 서쪽, 천산과 타클라마칸 사막 일대의 서방 지대',
    description:
      '실크로드가 지나가는 서북 변방으로, 공동파가 중원 쪽 관문을 지키며 그 너머 천산·투르판 일대에 마교 본산이나 이역 고수들이 자리하는 설정이 많습니다.',
    relatedIds: ['magyo', 'saeoe', 'jungwon'],
  },
  {
    id: 'sipmandaesan',
    term: '십만대산',
    hanja: '十萬大山',
    category: '지리·강호',
    summary: '험준한 봉우리가 끝없이 이어진 남서부·서역의 천연 요새 산악지대',
    description:
      '외부인의 접근이 극도로 어려운 험산 준령으로, 무협소설에서는 천마신교(마교)의 본산이나 은거 고수들의 수련처로 자주 등장합니다.',
    relatedIds: ['magyo', 'seoyeok'],
  },
  {
    id: 'gwando',
    term: '관도',
    hanja: '官道',
    category: '지리·강호',
    summary: '관부에서 정비해 주요 성도와 도시를 잇는 공식 간선 도로',
    description:
      '표국의 마차나 상단, 행인들이 주로 이용하는 큰 길입니다. 산맥과 하천을 우회하기 때문에 실제 이동 거리는 직선거리보다 약 1.25배 이상 길어집니다.',
    relatedIds: ['pyoguk', 'ri', 'jungwon'],
  },
  {
    id: 'ri',
    term: '리(里)',
    hanja: '里',
    category: '지리·강호',
    summary: '동아시아 전통 거리 단위 (1리 ≈ 약 0.4km)',
    description:
      '무협소설에서 노정을 표현할 때 쓰이는 전통 단위로, 10리는 약 4km, 100리는 약 40km, 1,000리는 약 400km에 해당합니다. 본 지도의 거리 계산기에서는 1리 = 0.4km로 환산합니다.',
    relatedIds: ['gwando', 'gyeonggong'],
  },

  // 인물·호칭
  {
    id: 'jangmunin',
    term: '장문인',
    hanja: '掌門人',
    category: '인물·호칭',
    summary: '정파·도가·검파 등 한 문파를 대표하고 이끄는 최고 수장',
    description:
      '화산파·무당파·아미파 등 문파의 무공 전승과 대외 교섭을 책임지는 수장입니다. 소림사는 방장(方丈), 개방은 방주(幇主), 세가는 가주(家主), 마교는 교주(敎主)라 부릅니다.',
    relatedIds: ['gaju', 'gyoju', 'gupailbang'],
  },
  {
    id: 'gaju',
    term: '가주',
    hanja: '家主',
    category: '인물·호칭',
    summary: '오대세가 등 무림 명문 가문을 총괄하는 우두머리',
    description:
      '혈연과 가문의 명예를 대표하며 가전 무공의 계승과 세가의 정치·경제적 결정을 내리는 최고 책임자입니다.',
    relatedIds: ['odaesega', 'jangmunin'],
  },
  {
    id: 'gyoju',
    term: '교주',
    hanja: '敎主',
    category: '인물·호칭',
    summary: '천마신교 등 종교적 교단을 통솔하는 절대적 최고 지도자',
    description:
      '교단 내에서 절대적 권위와 최강의 무력을 겸비한 수장으로, 천마신교의 경우 흔히 천마(天魔)로 불립니다.',
    relatedIds: ['magyo', 'cheonmasingong', 'jangmunin'],
  },
  {
    id: 'hyeopgaek',
    term: '협객',
    hanja: '俠客',
    category: '인물·호칭',
    summary: '의리와 신의를 목숨처럼 여기며 약자를 돕는 강호의 무인',
    description:
      '강자의 횡포에 맞서고 억울한 이를 돕는 무협 세계관의 이상적 인물상입니다. 여협(女俠), 대협(大俠) 등으로 불립니다.',
    relatedIds: ['gangho', 'jeongpa', 'gosu'],
    aliases: ['여협'],
  },
  {
    id: 'gosu',
    term: '고수',
    hanja: '高手',
    category: '인물·호칭',
    summary: '뛰어난 무공과 실전 경험을 갖춘 무림의 강자',
    description:
      '무공의 경지가 높아 강호에 명성을 떨치는 무인을 통칭합니다. 경지에 따라 일류 고수, 절정 고수, 천하제일인 등으로 구분됩니다.',
    relatedIds: ['jeoljeong', 'hwagyeong', 'hyeopgaek'],
  },
];

export const GLOSSARY_BY_ID: Record<string, GlossaryEntry> = Object.fromEntries(
  MURIM_GLOSSARY.map((entry) => [entry.id, entry]),
);

const glossaryImageModules = import.meta.glob<string>(
  '../assets/images/glossary/*.jpg',
  { eager: true, import: 'default' },
);

export const GLOSSARY_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(glossaryImageModules).map(([path, url]) => {
    const filename = path.split('/').pop() ?? '';
    const id = filename.replace(/\.jpg$/i, '');
    return [id, url];
  }),
);

// Build lookup map & sorted regex for matching Murim terms in plain text
const tokenToId = new Map<string, string>();
for (const entry of MURIM_GLOSSARY) {
  tokenToId.set(entry.term, entry.id);
  if (entry.aliases) {
    for (const alias of entry.aliases) {
      tokenToId.set(alias, entry.id);
    }
  }
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sortedTokens = Array.from(tokenToId.keys()).sort((a, b) => b.length - a.length);

export const GLOSSARY_MATCH_REGEX = new RegExp(
  `(${sortedTokens.map(escapeRegex).join('|')})`,
  'g',
);

export function resolveGlossaryId(token: string): string | undefined {
  return tokenToId.get(token);
}
