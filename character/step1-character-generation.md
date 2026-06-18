# Step 1 — 인물(캐릭터) 생성 스펙

> **목표:** 첫 번째 사진(실제 인물, 흉상)을 → **얼굴은 유지**하되 **현실적 7등신 / 키 165cm 정도의 전신샷**으로,
> **배경 없이(또는 단색 배경)** 만든다. 이렇게 만든 인물을 Step 2에서 캐릭터 시트에 넣는다.
>
> ⚠️ **이 작업은 이미지 생성 도구에서 직접 하셔야 합니다.** (Claude Code는 이미지를 생성/편집할 수 없음)
> 아래 프롬프트와 설정을 **복붙**해서 쓰시면 됩니다.

---

## 0. 시작 전에 알아둘 전제 (기대치 정렬)

1. **"얼굴 유지"는 얼굴(눈·코·입·눈썹·헤어)에만 적용됩니다.** 어깨 아래 체형·자세·손·옷은 원본에 없으므로 **AI가 새로 만듭니다.** 이건 정상이고 의도된 동작입니다.
2. **7등신 + 165cm는 사실상 평범한 성인 비율**입니다(성인 여성 평균이 7~7.5등신). 무리한 목표가 아니라 자연스럽게 나옵니다. "165cm"는 픽셀에는 의미가 없는 라벨이라, **머리:전신 = 1:7 비율**로 통제합니다.
3. **일관성이 핵심.** Step 2 시트에 들어갈 모든 컷(정면/측면/후면/3-4, 표정들)은 **반드시 같은 얼굴 레퍼런스(같은 시드/캐릭터 참조)로** 뽑아야 캐릭터가 안 흔들립니다. → [4. 일관성 유지법] 참고.
4. **초상권:** 1번은 실존 인물 사진입니다. **본인 얼굴**이라는 전제로 진행합니다. 타인 사진이면 동의가 필요합니다.

---

## 1. 추천 도구 (얼굴 고정이 되는 것만)

| 우선순위 | 도구 | 왜 |
|---|---|---|
| ⭐ 1순위 | **Google Gemini — "Nano Banana" (Gemini 2.5 Flash Image)** | 사진 업로드 → 대화형으로 "이 사람 얼굴 그대로 전신으로", "배경 지워줘"가 가장 잘 먹힘. 얼굴 동일성 보존 최강급. |
| 2순위 | **Midjourney v7 + `--cref`(캐릭터 레퍼런스)** | 얼굴 참조 강력. 단, 옷/체형도 같이 끌려오므로 `--cw` 값 조절 필요(아래). |
| 3순위 | **ChatGPT / GPT image** | 접근성 좋음. 얼굴 동일성은 위 둘보다 약간 약함. |
| 보조 | **Flux Kontext** | "원본 편집(흉상→전신)" 계열. 얼굴 유지 편집에 강함. |

> 결론: **Gemini(나노바나나)로 시작**을 추천합니다. 사진 올리고 한국어로 시켜도 됩니다.

---

## 2. 복붙용 프롬프트

### 2-A. 공통(영어) — 이미지 모델은 영어가 더 잘 먹습니다

**Positive prompt**
```
Full-body studio photo of the SAME young Korean woman as in the reference image.
Preserve her exact facial identity: same eyes, nose, lips, eyebrows, face shape, and the same
natural light-brown wavy long hair with soft side-swept see-through bangs. Natural light makeup.
Photorealistic, soft even studio lighting, sharp focus, true-to-life skin texture.

She stands straight, relaxed neutral A-pose, arms slightly away from the body, hands relaxed and
fully visible, looking straight at the camera, calm natural expression.
Realistic slim adult body proportions, about 7 to 7.5 heads tall (head-to-height ratio ~1:7),
apparent height around 165 cm.

Outfit: simple fitted plain white short-sleeve t-shirt, light grey cotton shorts, white ankle socks,
clean white sneakers.

Framing: full figure from head to toe, small margin above the head and below the feet, vertical shot,
eye-level camera. Plain seamless solid white background (#FFFFFF), no props, no cast shadows on the wall.
High detail, 8k.
```

**Negative prompt** (모델에 negative 칸이 있으면)
```
cropped, cut-off feet, cut-off head, out of frame, extra fingers, missing fingers, deformed hands,
mutated limbs, multiple people, duplicate, text, watermark, logo, busy or cluttered background,
office, furniture, harsh shadows, distorted face, different face, child proportions, chibi,
oversized head, big head, low resolution, blurry, plastic skin, oversaturated
```

**설정**
- 비율(aspect ratio): **2:3** 또는 **9:16** (전신이라 세로로 긴 게 유리)
- 화질/스텝: 최대
- ⭐ **시드(seed) 고정**: 마음에 드는 결과가 나오면 **그 시드를 적어두세요.** Step 2에서 재사용합니다.

---

### 2-B. Gemini(나노바나나)용 — 한국어 대화 그대로 써도 됨

1단계 (사진 업로드 후):
```
이 사진 속 인물의 얼굴(눈·코·입·눈썹·헤어스타일과 머리색)을 그대로 유지해서,
같은 사람의 전신 사진을 만들어줘.
- 현실적인 성인 비율(머리:전신 = 약 1:7, 7등신), 키 165cm 정도 느낌
- 똑바로 선 자연스러운 A자 포즈, 손은 다 보이게, 정면을 봄
- 흰색 반팔 티셔츠 + 연회색 면 반바지 + 흰 양말 + 흰 운동화
- 머리부터 발끝까지 다 보이게, 세로 사진
- 배경은 순백색(#FFFFFF) 단색, 소품·그림자 없음
- 실사풍, 부드러운 스튜디오 조명, 고해상도
```

2단계 (배경 제거):
```
방금 만든 이미지에서 인물만 남기고 배경을 완전히 투명(transparent PNG)하게 만들어줘.
가장자리(특히 머리카락) 깔끔하게.
```

---

### 2-C. Midjourney v7용

```
full-body studio photo of a young Korean woman, light-brown wavy long hair with side-swept see-through bangs,
natural light makeup, standing straight in relaxed neutral A-pose, hands visible, looking at camera,
realistic adult proportions ~7.5 heads tall, plain white t-shirt, light grey shorts, white socks, white sneakers,
full figure head to toe, seamless white background, soft even studio lighting, photorealistic
--cref <첫번째_사진_URL> --cw 30 --ar 2:3 --style raw --v 7
```
- `--cref` 뒤에 **첫 번째 사진의 URL**을 넣으세요.
- `--cw`(character weight): **0~40 권장.** 값이 낮을수록 *얼굴만* 참조하고 옷·체형은 새로 만듭니다(= 우리가 원하는 것). 100이면 옷까지 따라옵니다. 30에서 시작해 조절하세요.

---

## 3. 배경 제거 (단색으로 뽑았을 때)

투명 PNG가 바로 안 나오면 단색(흰색) 배경으로 뽑은 뒤 제거:
- **remove.bg** (웹, 가장 간단) / **Photoshop** "개체 선택" / **Gemini에 "배경 투명하게"** 재요청
- 결과는 `character/reference/` 폴더에 **`character_fullbody.png`** (배경 투명)로 저장해두면 Step 2에서 바로 씁니다.

---

## 4. 일관성 유지법 (Step 2를 위해 지금부터 중요)

캐릭터 시트엔 **여러 컷**이 들어갑니다(정면/측면/후면/3-4뷰, 표정 5종 등). 이게 **다 같은 사람**으로 보이게 하려면:
- ✅ **같은 얼굴 레퍼런스**(또는 Midjourney `--cref` 동일 URL)로 모든 컷 생성
- ✅ **시드 고정**(2-A 참고)
- ✅ 옷·머리색·메이크업 **문장을 매번 동일하게** 유지 (위 프롬프트 재사용)
- ✅ Gemini라면: 1번에서 만든 전신 이미지를 **다시 업로드**하고 "이 캐릭터의 측면 모습", "이 캐릭터가 웃는 표정" 식으로 이어서 시키기 → 동일성 가장 잘 유지됨

---

## 5. 합격 체크리스트 (다음 단계로 넘어가기 전)

- [ ] 얼굴이 원본과 같은 사람으로 보인다 (눈·코·입·헤어)
- [ ] 머리:전신 ≈ 1:7 (머리가 너무 크지/작지 않다)
- [ ] **발끝·머리끝이 잘리지 않았다**
- [ ] 손가락이 정상 (개수·모양)
- [ ] 배경이 깨끗하게 제거됨 (또는 순백색)
- [ ] **시드/레퍼런스를 기록해 뒀다** ← Step 2 필수

---

## 다음 단계

위 체크리스트를 통과한 **전신 이미지(배경 제거)**가 나오면,
`character/reference/character_fullbody.png`로 저장하고 저에게 알려주세요.
그럼 **Step 2: 캐릭터 시트 레이아웃(HTML/CSS) 제작**으로 넘어갑니다.
(두 번째 사진처럼 프로필·턴어라운드·표정·의상/소품·컬러팔레트 칸이 있는 보드를 코드로 짜서, 생성한 컷들을 끼워 넣고 PDF로 출력)
