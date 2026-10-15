/* =========================================================
   기사 본문 넣는 곳 (이 파일만 고치면 됨)

   방법:
   1. 원문 페이지에서 본문 첫 문단부터 마지막 문단까지 드래그해서 복사
      (제목, 작성자, 날짜는 이미 들어가 있으니 빼고 본문만)
   2. 아래 FENCE_TEXT 또는 COLOUR_TEXT의 ` ` (백틱) 사이 내용을 전부 지우고 붙여 넣기
   3. 저장하고 index.html 새로고침

   - 한 줄 = 한 문단으로 자동으로 나뉨 (빈 줄은 무시)
   - 원문 소제목은 자동으로 알아보고 소제목 모양으로 바뀜
   - "READ MORE", 사진 설명 같은 줄이 섞여 들어가면 그 줄만 지우면 됨
   - 문단 수가 달라져도 블록은 기사 전체에 알아서 고르게 배치됨
   ========================================================= */


/* ---------- 1. 울타리 기사 (PBS / AP) ----------
   https://www.pbs.org/newshour/politics/trump-appointees-advance-plans-for-lafayette-square-fencing-and-white-house-gates
   지금 들어 있는 건 임시 본문. 원문으로 통째로 바꿔 넣기 */
const FENCE_TEXT = `
Parts of President Donald Trump's broad makeover of Washington took another step toward approval on Thursday. The most criticized piece was a plan for permanent fencing and gates around Lafayette Square, the park directly in front of the White House.

The plan sets the security concerns of the Secret Service and the administration against the park's long history as an open gathering place. People come to Lafayette Square to take selfies, to protest wars and to celebrate election results on the spot.

Pam Fessler, a former federal employee and retired journalist, told the National Capital Planning Commission that people came to the square because they understood it as the nation's town square, a place to say what they felt about where the country was headed.

The commission, which this spring approved Trump's White House ballroom after he tore down the East Wing without authorization, accepted several versions of the fencing proposal despite the criticism. That sets up a final vote in the coming months. In a separate decision, the panel approved the concept for a new visitor security screening center on the grounds south of the Treasury Department.

Beyond security, the Secret Service and the administration presented the fence as a matter of appearance. It would replace the temporary fencing and barricades that have stood in the area since the 2020 protests over systemic racism and police violence. Historic preservationists, legal advocates and Washington residents pushed back. The real solution, they said, is simply to reopen the square.

Laura Follansbee, an attorney with the ACLU, said the proposal claims a fence will preserve everyday openness. But even with the gates open, she argued, the fence itself would tell the public that the park is "only open by permission."

Opponents predict gates would be closed often

Opponents also predicted that a president or the Secret Service would find it too easy to close the gates without a real threat. Fessler said shutting the park whenever a protest or large gathering was expected would become routine.

Commission chairman Mark Paoletta, a Trump appointee, rejected those concerns. He said he did not believe the Secret Service had any intention of closing the park during peaceful protests, and he dismissed the idea that a fence would cost people their First Amendment rights. People can still come to the park, he said, within rules on time, place and manner. It was his first meeting as chairman. White House Counsel Will Scharf held the role before him.

The visitor screening facility drew far less debate, and commissioners broadly agreed it was needed to streamline entry to the White House complex. Thursday's hearing was the first time the commission took up either idea. So far, neither the planning commission nor the U.S. Commission of Fine Arts, which is controlled by Trump appointees, has stood in the way of the president's plans for the capital. The fine arts panel approved the visitor center in July and heard a presentation on the fencing without taking action.

Commissioner Evan Cash, who was not appointed by Trump, voiced frustration that the Secret Service was pushing the project only a decade after winning approval for a 13-foot fence around the White House perimeter. He said he had gone along with a great deal back then, and would not have if he had known people would later be pushed another block away from the White House.

Assassination attempts have fueled the White House argument

Paoletta pointed to the assassination attempts against Trump: two during the 2024 campaign and a third this past April, when he attended a Washington dinner with White House journalists. Concern rose again in May, after Secret Service officers fatally shot a man who opened fire near a White House security checkpoint.

Still, the fence would permanently change how the grounds in front of the White House look and how people reach them. The square has not had a permanent fence since the late 1800s. The administration's 79-page proposal for the 8-acre park calls for fencing all the way around, with larger gates at the north and south entrances. Its options either include or leave out the monuments at the park's four corners.

The visitor screening facility, by contrast, has been treated as an uncontroversial part of the push for more security. The administration wants the permanent building open by July 2028 to replace the temporary tents used for years. It was first designed to sit underground near the southern end of Sherman Park, southeast of the White House, but was moved to the park's western edge, away from utility infrastructure.
`;

// 이 기사의 원문 소제목 (붙여 넣은 글에 이 줄이 있으면 소제목으로 바뀜)
const FENCE_SUBHEADS = [
  'Opponents predict gates would be closed often',
  'Assassination attempts have fueled the White House argument',
];


/* ---------- 2. 만지는 기사 (NPR, Lauren Frayer) ----------
   https://www.wlrn.org/2015-05-26/do-touch-the-artwork-at-prados-exhibit-for-the-blind
   지금 들어 있는 건 원문 내용을 순서대로 다시 쓴 임시 본문. 원문으로 통째로 바꿔 넣기 */
const TOUCH_TEXT = `
Many art museums post signs asking visitors not to touch. At Spain's Prado Museum, a new exhibit turns that rule around. Here, visitors are allowed to touch the paintings, and they are encouraged to.

The Prado has made three-dimensional copies of famous works by Francisco Goya, Diego Velázquez and El Greco so that blind visitors can feel them.

Guadelupe Iglesias, 53, lost her sight to a retinal disease in 2001. Since then, she says, she has been to a museum only about twice. Audio guides describe the paintings, but she has had to imagine what they look like. Before she lost her sight, she used to bring her daughter and friends to the Prado to see a Velázquez.

Now she runs her hands over a 3-D copy of that painter's 17th-century Apollo in the Forge of Vulcan. She finds the raised laurel crown on Apollo's head while a guide describes the scene, and she is delighted.

A Different Way To Experience Art

Most of the exhibit's visitors are not visually impaired. The museum hands them opaque glasses that work like blindfolds.

Isabel O'Donnell, a 20-year-old college student from Buffalo, New York, visiting Madrid, found it strange. She kept peeking over the glasses because it was hard to tell what she was touching. Still, she called it a cool way to experience art, even for sighted people, and said touching a painting gives a sense of what its figures would feel like if they were real.

Color And Texture

To choose which paintings would work, the Prado consulted ONCE, Spain's national organization for the blind. Curators photographed each masterpiece in high resolution, then painted over the images with special pigments.

Fernando Pérez Suescun, a curator on the Prado's education team, explains that the paint reacts to ultraviolet light and swells, giving the image volume and texture. A printing company in northern Spain developed the pigments, which were used before at the Fine Arts Museum in Bilbao.

The Prado says this is not the first 3-D art exhibit for blind visitors, but it is one of the few to include both color and texture. Earlier projects in New York, London, Florence and Mexico City used 3-D-printed copies of sculptures or textured black-and-white versions of paintings.

Ana Rosa Argente's vision is getting worse, though she is not yet classified as blind. She can see light and some colors and uses texture to fill in the rest of the picture in her mind. She says the exhibit works well for people with partial sight.

The exhibit includes six paintings from the Prado's collection, among them a copy of the Mona Lisa painted by an apprentice of Leonardo da Vinci. Some copies are scaled down so visitors can reach the whole image without moving around. All come with Braille text.

Pérez Suescun says it feels like he is encouraging visitors to break the museum's rules. He laughs about telling people to leave their fingerprints all over the paintings.

It is the only exhibit at the Prado with hand sanitizer dispensers, and water bowls for guide dogs. "Touching the Prado" runs through June 28.
`;

const TOUCH_SUBHEADS = [
  'A Different Way To Experience Art',
  'Color And Texture',
];

// 기사 사이에 들어가는 사진 (점자 무늬로 가려져 있다가 만지면 보임)
// after : 몇 번째 문단 다음에 넣을지 (소제목은 안 셈)
// src   : images 폴더 안 파일 이름. 이 이름으로 사진을 넣으면 됨 (파일이 없으면 그 자리는 그냥 안 나옴)
const TOUCH_IMAGES = [
  { after: 4,  src: 'images/touch-01.jpg' },
  { after: 7,  src: 'images/touch-02.jpg' },
  { after: 11, src: 'images/touch-03.jpg' },
];
