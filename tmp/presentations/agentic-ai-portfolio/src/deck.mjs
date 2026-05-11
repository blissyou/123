import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Presentation, PresentationFile, drawSlideToCtx } from "@oai/artifact-tool";
import { Canvas } from "../node_modules/@oai/artifact-tool/node_modules/skia-canvas/lib/index.js";

const WIDTH = 1920;
const HEIGHT = 1080;

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scratchDir = path.join(workspaceDir, "scratch");
const outputDir = path.join(workspaceDir, "output");

fs.mkdirSync(scratchDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });

const C = {
  navy: "#16324F",
  navy2: "#1D4368",
  sand: "#F7F2E8",
  white: "#FFFFFF",
  ink: "#13263B",
  muted: "#5F768A",
  line: "#D4DDE4",
  mint: "#DDF4EE",
  pale: "#E6EEF5",
  gold: "#F5D27A",
  coral: "#EF7A73",
  peach: "#FCE7E2",
  sky: "#E3F0FB",
  teal: "#60D4C8",
};

function setTextStyle(target, style) {
  target.text.typeface = style.typeface ?? "Malgun Gothic";
  target.text.fontSize = style.fontSize ?? 24;
  target.text.color = style.color ?? C.ink;
  target.text.bold = style.bold ?? false;
  target.text.italic = style.italic ?? false;
  target.text.alignment = style.alignment ?? "left";
  target.text.verticalAlignment = style.verticalAlignment ?? "top";
  target.text.wrap = style.wrap ?? "square";
  if (style.insets) target.text.insets = style.insets;
  if (style.lineSpacing) target.text.lineSpacing = style.lineSpacing;
}

function addShape(slide, {
  geometry = "rect",
  left,
  top,
  width,
  height,
  fill,
  line,
  text,
  textStyle,
  name,
}) {
  const shape = slide.shapes.add({
    geometry,
    name,
    position: { left, top, width, height },
    fill: { type: "solid", color: fill ?? C.white },
    line: { style: "solid", fill: line ?? fill ?? C.white, width: line ? 1 : 0 },
  });

  if (text !== undefined) {
    shape.text.set(text);
    setTextStyle(shape, textStyle ?? {});
  }

  return shape;
}

function addText(slide, {
  left,
  top,
  width,
  height,
  text,
  textStyle,
  fill = C.white,
  line = C.white,
  name,
}) {
  return addShape(slide, {
    geometry: "rect",
    left,
    top,
    width,
    height,
    fill,
    line,
    text,
    textStyle,
    name,
  });
}

function addSlideBackground(slide, fill) {
  const bg = addShape(slide, {
    left: 0,
    top: 0,
    width: WIDTH,
    height: HEIGHT,
    fill,
    line: fill,
    name: "bg",
  });
  bg.sendToBack();
  return bg;
}

function addCoverSlide(p) {
  const slide = p.slides.add();
  addSlideBackground(slide, C.sand);
  addShape(slide, { left: 1080, top: 0, width: 840, height: 1080, fill: C.navy, line: C.navy });
  addShape(slide, { geometry: "ellipse", left: 1275, top: 86, width: 250, height: 250, fill: C.teal, line: C.teal });
  addShape(slide, { geometry: "ellipse", left: 1575, top: 790, width: 180, height: 180, fill: C.gold, line: C.gold });
  addShape(slide, { geometry: "ellipse", left: 1000, top: 750, width: 120, height: 120, fill: C.coral, line: C.coral });

  addText(slide, {
    left: 110,
    top: 90,
    width: 360,
    height: 40,
    text: "기술 포트폴리오",
    textStyle: { fontSize: 26, color: C.coral, bold: true },
    fill: C.sand,
    line: C.sand,
  });
  addText(slide, {
    left: 110,
    top: 150,
    width: 820,
    height: 220,
    text: "에이전틱 AI 기반\n업무 자동화 기술",
    textStyle: { fontSize: 66, color: C.ink, bold: true, lineSpacing: 1.05 },
    fill: C.sand,
    line: C.sand,
  });
  addText(slide, {
    left: 112,
    top: 395,
    width: 820,
    height: 110,
    text: "자비스형 개인 비서 시스템을 중심으로 본\n개발연구·서비스혁신·중기연구 분석",
    textStyle: { fontSize: 28, color: C.muted },
    fill: C.sand,
    line: C.sand,
  });

  addText(slide, {
    left: 1170,
    top: 300,
    width: 560,
    height: 38,
    text: "핵심 질문",
    textStyle: { fontSize: 28, color: "#A8C6DA", bold: true },
    fill: C.navy,
    line: C.navy,
  });
  addText(slide, {
    left: 1170,
    top: 352,
    width: 620,
    height: 180,
    text: "AI는 이제 답변을 넘어서\n스스로 계획하고 실행하는가?",
    textStyle: { fontSize: 52, color: C.white, bold: true, lineSpacing: 1.06 },
    fill: C.navy,
    line: C.navy,
  });
  addText(slide, {
    left: 1172,
    top: 560,
    width: 560,
    height: 110,
    text: "일정 관리, 문서 작성, 정보 검색, 후속 조치까지 하나의 흐름으로 연결하는 지능형 자동화가 핵심입니다.",
    textStyle: { fontSize: 24, color: "#D8E4EE" },
    fill: C.navy,
    line: C.navy,
  });

  addText(slide, {
    left: 1185,
    top: 735,
    width: 500,
    height: 32,
    text: "발표 흐름",
    textStyle: { fontSize: 22, color: "#A8C6DA", bold: true },
    fill: C.navy,
    line: C.navy,
  });
  addText(slide, {
    left: 1185,
    top: 780,
    width: 520,
    height: 130,
    text: "1. 기술 개념과 중요성\n2. 포트폴리오 3축 분석\n3. 산업동향과 사업화 평가",
    textStyle: { fontSize: 28, color: C.white, lineSpacing: 1.12 },
    fill: C.navy,
    line: C.navy,
  });
}

function addConceptSlide(p) {
  const slide = p.slides.add();
  addSlideBackground(slide, C.white);
  addShape(slide, { left: 0, top: 0, width: 620, height: 1080, fill: C.navy, line: C.navy });

  addText(slide, {
    left: 88,
    top: 92,
    width: 260,
    height: 36,
    text: "개념 정의",
    textStyle: { fontSize: 26, color: C.teal, bold: true },
    fill: C.navy,
    line: C.navy,
  });
  addText(slide, {
    left: 88,
    top: 150,
    width: 420,
    height: 280,
    text: "에이전틱 AI는\n'대답하는 AI'가 아니라\n'행동하는 AI'입니다.",
    textStyle: { fontSize: 56, color: C.white, bold: true, lineSpacing: 1.05 },
    fill: C.navy,
    line: C.navy,
  });
  addText(slide, {
    left: 90,
    top: 470,
    width: 420,
    height: 180,
    text: "사용자 목표를 이해하고, 필요한 순서를 계획한 뒤, 여러 도구를 호출해 실제 업무를 처리하는 구조입니다.",
    textStyle: { fontSize: 25, color: "#D8E4EE" },
    fill: C.navy,
    line: C.navy,
  });

  addText(slide, {
    left: 700,
    top: 90,
    width: 650,
    height: 48,
    text: "자비스 프로젝트와 연결되는 동작 흐름",
    textStyle: { fontSize: 42, color: C.ink, bold: true },
    fill: C.white,
    line: C.white,
  });

  const cards = [
    { left: 710, top: 200, fill: C.mint, title: "사용자 목표", body: "회의록 정리\n일정 관리 요청" },
    { left: 980, top: 200, fill: C.sand, title: "계획 수립", body: "우선순위 판단\n작업 순서 결정" },
    { left: 1250, top: 200, fill: C.pale, title: "도구 실행", body: "문서 작성\n검색·API 호출" },
    { left: 1520, top: 200, fill: C.peach, title: "결과 보고", body: "정리·후속조치\n다음 행동 제안" },
  ];

  for (const card of cards) {
    addShape(slide, { geometry: "roundRect", left: card.left, top: card.top, width: 220, height: 188, fill: card.fill, line: card.fill });
    addText(slide, {
      left: card.left + 22,
      top: card.top + 26,
      width: 176,
      height: 32,
      text: card.title,
      textStyle: { fontSize: 28, color: C.ink, bold: true, alignment: "center" },
      fill: card.fill,
      line: card.fill,
    });
    addText(slide, {
      left: card.left + 18,
      top: card.top + 78,
      width: 184,
      height: 80,
      text: card.body,
      textStyle: { fontSize: 24, color: C.ink, alignment: "center", lineSpacing: 1.1 },
      fill: card.fill,
      line: card.fill,
    });
  }

  addText(slide, {
    left: 710,
    top: 470,
    width: 480,
    height: 42,
    text: "일반 챗봇과의 차이",
    textStyle: { fontSize: 30, color: C.ink, bold: true },
    fill: C.white,
    line: C.white,
  });
  addText(slide, {
    left: 710,
    top: 520,
    width: 500,
    height: 180,
    text: "일반 챗봇은 질문에 답하고 끝나지만, 에이전틱 AI는 일정 정리, 메일 초안, 후속 작업 생성처럼 여러 단계를 연속 수행합니다.",
    textStyle: { fontSize: 24, color: C.muted },
    fill: C.white,
    line: C.white,
  });
  addText(slide, {
    left: 1260,
    top: 470,
    width: 480,
    height: 42,
    text: "자비스형 시스템의 의미",
    textStyle: { fontSize: 30, color: C.ink, bold: true },
    fill: C.white,
    line: C.white,
  });
  addText(slide, {
    left: 1260,
    top: 520,
    width: 500,
    height: 180,
    text: "네 프로젝트는 목표 해석, 작업 계획, 도구 실행, 결과 보고가 연결된 개인 비서형 AI이므로 에이전틱 AI의 대표적 응용 사례로 설명할 수 있습니다.",
    textStyle: { fontSize: 24, color: C.muted },
    fill: C.white,
    line: C.white,
  });
}

function addPortfolioSlide(p) {
  const slide = p.slides.add();
  addSlideBackground(slide, "#F8FAFB");

  addText(slide, {
    left: 100,
    top: 88,
    width: 620,
    height: 48,
    text: "기술 포트폴리오 3축 배치",
    textStyle: { fontSize: 48, color: C.ink, bold: true },
    fill: "#F8FAFB",
    line: "#F8FAFB",
  });
  addText(slide, {
    left: 100,
    top: 150,
    width: 1580,
    height: 80,
    text: "에이전틱 AI 기반 업무 자동화 기술은 기존 AI와 자동화 기술을 결합해 실사용 시스템으로 구현하는 프로젝트이므로 아래 위치가 가장 적절합니다.",
    textStyle: { fontSize: 24, color: C.muted },
    fill: "#F8FAFB",
    line: "#F8FAFB",
  });

  const cols = [100, 360, 650];
  const widths = [220, 250, 1170];
  const headerTop = 250;
  const rowTops = [336, 514, 692];
  const rowHeight = 150;

  const headerTexts = ["구분", "선택 항목", "선정 이유"];
  for (let i = 0; i < 3; i += 1) {
    addShape(slide, { geometry: "roundRect", left: cols[i], top: headerTop, width: widths[i], height: 70, fill: C.navy, line: C.navy });
    addText(slide, {
      left: cols[i],
      top: headerTop + 16,
      width: widths[i],
      height: 36,
      text: headerTexts[i],
      textStyle: { fontSize: 24, color: C.white, bold: true, alignment: "center" },
      fill: C.navy,
      line: C.navy,
    });
  }

  const rows = [
    ["연구의 성격", "개발연구", "기존 LLM·API·자동화 기술을 결합해 실제로 동작하는 시스템을 구현하는 성격이 가장 강함"],
    ["혁신의 유형", "서비스혁신", "물리적 제품보다 사용자의 업무 방식과 서비스 제공 구조를 바꾸며 생산성을 높이는 디지털 혁신에 해당"],
    ["연구 기간", "중기연구", "프로토타입 이후에도 정확도, 보안, 권한 통제, 사용자 경험을 계속 고도화해야 하므로 중기 관점이 적절"],
  ];
  const rowFills = [C.white, C.white, C.white];
  const choiceFills = [C.mint, C.sand, C.pale];

  for (let r = 0; r < rows.length; r += 1) {
    addShape(slide, { geometry: "roundRect", left: cols[0], top: rowTops[r], width: widths[0], height: rowHeight, fill: rowFills[r], line: C.line });
    addShape(slide, { geometry: "roundRect", left: cols[1], top: rowTops[r], width: widths[1], height: rowHeight, fill: choiceFills[r], line: choiceFills[r] });
    addShape(slide, { geometry: "roundRect", left: cols[2], top: rowTops[r], width: widths[2], height: rowHeight, fill: rowFills[r], line: C.line });

    addText(slide, {
      left: cols[0] + 18,
      top: rowTops[r] + 48,
      width: widths[0] - 36,
      height: 40,
      text: rows[r][0],
      textStyle: { fontSize: 28, color: C.ink, bold: true, alignment: "center", verticalAlignment: "middle" },
      fill: rowFills[r],
      line: rowFills[r],
    });
    addText(slide, {
      left: cols[1] + 12,
      top: rowTops[r] + 48,
      width: widths[1] - 24,
      height: 42,
      text: rows[r][1],
      textStyle: { fontSize: 34, color: C.ink, bold: true, alignment: "center", verticalAlignment: "middle" },
      fill: choiceFills[r],
      line: choiceFills[r],
    });
    addText(slide, {
      left: cols[2] + 28,
      top: rowTops[r] + 36,
      width: widths[2] - 56,
      height: 78,
      text: rows[r][2],
      textStyle: { fontSize: 24, color: C.muted },
      fill: rowFills[r],
      line: rowFills[r],
    });
  }

  const notes = [
    ["교수님 포인트", "기초연구가 아니라는 점을 분명히 하고, '실제 구현과 서비스 적용성'을 강조하면 논리가 더 선명해집니다."],
    ["발표 연결 문장", "즉, 이 기술은 새로운 과학 원리의 발견보다 기존 기술을 실제 업무 흐름에 맞게 구현하는 개발연구 성격이 강합니다."],
    ["나의 프로젝트와 연결", "자비스 프로젝트는 단순 챗봇이 아니라 업무를 실행하는 시스템이므로 서비스혁신과 중기 고도화 관점이 자연스럽습니다."],
  ];
  const noteLefts = [100, 675, 1250];

  for (let i = 0; i < notes.length; i += 1) {
    addText(slide, {
      left: noteLefts[i],
      top: 900,
      width: 480,
      height: 34,
      text: notes[i][0],
      textStyle: { fontSize: 24, color: C.coral, bold: true },
      fill: "#F8FAFB",
      line: "#F8FAFB",
    });
    addText(slide, {
      left: noteLefts[i],
      top: 946,
      width: 500,
      height: 90,
      text: notes[i][1],
      textStyle: { fontSize: 22, color: C.muted },
      fill: "#F8FAFB",
      line: "#F8FAFB",
    });
  }
}

function addTrendSlide(p) {
  const slide = p.slides.add();
  addSlideBackground(slide, C.white);

  addText(slide, {
    left: 100,
    top: 88,
    width: 820,
    height: 50,
    text: "산업 동향과 기술 발전 단계",
    textStyle: { fontSize: 48, color: C.ink, bold: true },
    fill: C.white,
    line: C.white,
  });
  addText(slide, {
    left: 100,
    top: 150,
    width: 1600,
    height: 80,
    text: "에이전틱 AI는 아직 초기 상용화 단계이지만, 글로벌 빅테크와 기업용 소프트웨어 기업들이 빠르게 제품화하고 있습니다.",
    textStyle: { fontSize: 24, color: C.muted },
    fill: C.white,
    line: C.white,
  });

  const statCards = [
    {
      left: 110,
      top: 270,
      width: 520,
      height: 250,
      fill: C.navy,
      title: "40%",
      body: "2026년 말까지 기업용 앱의 40%가 작업 특화 AI 에이전트를 포함할 것으로 Gartner는 전망",
      titleColor: C.white,
      bodyColor: "#D7E4EE",
    },
    {
      left: 700,
      top: 270,
      width: 520,
      height: 250,
      fill: C.mint,
      title: "80%",
      body: "2029년까지 common customer service 이슈의 80%를 agentic AI가 자율 해결할 수 있다고 전망",
      titleColor: C.ink,
      bodyColor: C.muted,
    },
    {
      left: 1290,
      top: 270,
      width: 520,
      height: 250,
      fill: C.sand,
      title: "핵심 기업",
      body: "Microsoft, Salesforce, Google, OpenAI, IBM\nCopilot Studio와 Agentforce가 대표 사례",
      titleColor: C.ink,
      bodyColor: C.muted,
    },
  ];

  for (const card of statCards) {
    addShape(slide, { geometry: "roundRect", left: card.left, top: card.top, width: card.width, height: card.height, fill: card.fill, line: card.fill });
    addText(slide, {
      left: card.left + 30,
      top: card.top + 30,
      width: card.width - 60,
      height: 70,
      text: card.title,
      textStyle: { fontSize: card.title === "핵심 기업" ? 34 : 68, color: card.titleColor, bold: true },
      fill: card.fill,
      line: card.fill,
    });
    addText(slide, {
      left: card.left + 32,
      top: card.top + 115,
      width: card.width - 64,
      height: 100,
      text: card.body,
      textStyle: { fontSize: 23, color: card.bodyColor, lineSpacing: 1.08 },
      fill: card.fill,
      line: card.fill,
    });
  }

  addText(slide, {
    left: 110,
    top: 610,
    width: 300,
    height: 34,
    text: "현재 기술 수준",
    textStyle: { fontSize: 26, color: C.coral, bold: true },
    fill: C.white,
    line: C.white,
  });
  addText(slide, {
    left: 110,
    top: 654,
    width: 620,
    height: 64,
    text: "초기 상용화 단계",
    textStyle: { fontSize: 46, color: C.ink, bold: true },
    fill: C.white,
    line: C.white,
  });
  addText(slide, {
    left: 110,
    top: 724,
    width: 680,
    height: 130,
    text: "기술적으로는 프로토타입을 넘어 제품화가 진행 중이지만, 완전 자율형 시스템은 아직 오류, 보안, 책임 문제로 제한적입니다.",
    textStyle: { fontSize: 24, color: C.muted },
    fill: C.white,
    line: C.white,
  });

  addText(slide, {
    left: 930,
    top: 610,
    width: 300,
    height: 34,
    text: "향후 발전 가능성",
    textStyle: { fontSize: 26, color: C.coral, bold: true },
    fill: C.white,
    line: C.white,
  });
  addText(slide, {
    left: 930,
    top: 654,
    width: 820,
    height: 132,
    text: "단일 에이전트에서 멀티에이전트 협업으로,\n개인 비서형 AI에서 기업 전사 업무 플랫폼으로 확장될 가능성이 큽니다.",
    textStyle: { fontSize: 34, color: C.ink, bold: true, lineSpacing: 1.08 },
    fill: C.white,
    line: C.white,
  });
  addText(slide, {
    left: 930,
    top: 815,
    width: 820,
    height: 120,
    text: "주의점: 비용 대비 성과가 불분명하거나 위험 통제가 부족하면 프로젝트가 중단될 수 있으며, 실제 ROI를 보여주는 적용 분야가 중요합니다.",
    textStyle: { fontSize: 24, color: C.muted },
    fill: C.white,
    line: C.white,
  });

  addText(slide, {
    left: 104,
    top: 1010,
    width: 1600,
    height: 18,
    text: "출처: Gartner(2024-10-21, 2025-03-05, 2025-08-26), Microsoft(2024-10-21), Salesforce(2024-09-12)",
    textStyle: { fontSize: 14, color: "#7B8A96" },
    fill: C.white,
    line: C.white,
  });
}

function addBusinessSlide(p) {
  const slide = p.slides.add();
  addSlideBackground(slide, "#FBFCFC");

  addText(slide, {
    left: 100,
    top: 88,
    width: 760,
    height: 48,
    text: "사업화 가능성 및 SWOT",
    textStyle: { fontSize: 48, color: C.ink, bold: true },
    fill: "#FBFCFC",
    line: "#FBFCFC",
  });
  addText(slide, {
    left: 100,
    top: 148,
    width: 1600,
    height: 80,
    text: "이 기술은 반복 사무업무 자동화, 생산성 향상, 기업 내 AI 전환과 직접 연결되기 때문에 기술성과 사업성을 동시에 설명하기 좋습니다.",
    textStyle: { fontSize: 24, color: C.muted },
    fill: "#FBFCFC",
    line: "#FBFCFC",
  });

  const bizCards = [
    ["시장성", "기업용 AI 소프트웨어의 핵심 성장 축", "문서작성, 고객응대, 일정관리, 리서치, 내부 협업으로 확장 범위가 넓습니다."],
    ["수익 모델", "SaaS + 맞춤 구축 + 사용량 과금", "기업 구독형, 팀 단위 요금제, API 사용량 과금, 산업별 특화 솔루션으로 수익화가 가능합니다."],
    ["경쟁 구조", "RPA와 챗봇을 넘어서는 실행형 AI", "기존 RPA보다 유연하고, 일반 챗봇보다 실제 실행력이 높다는 점이 차별점입니다."],
  ];

  for (let i = 0; i < bizCards.length; i += 1) {
    const left = 100 + i * 585;
    addShape(slide, { geometry: "roundRect", left, top: 270, width: 550, height: 280, fill: C.white, line: C.line });
    addText(slide, {
      left: left + 30,
      top: 298,
      width: 180,
      height: 30,
      text: bizCards[i][0],
      textStyle: { fontSize: 26, color: C.coral, bold: true },
      fill: C.white,
      line: C.white,
    });
    addText(slide, {
      left: left + 30,
      top: 344,
      width: 450,
      height: 84,
      text: bizCards[i][1],
      textStyle: { fontSize: 36, color: C.ink, bold: true, lineSpacing: 1.05 },
      fill: C.white,
      line: C.white,
    });
    addText(slide, {
      left: left + 30,
      top: 444,
      width: 470,
      height: 82,
      text: bizCards[i][2],
      textStyle: { fontSize: 23, color: C.muted },
      fill: C.white,
      line: C.white,
    });
  }

  const swot = [
    ["S", "Strength", "생산성 향상 효과가 직관적이고 적용 산업이 매우 넓음", C.mint, C.navy],
    ["W", "Weakness", "오류, 환각, 보안 문제로 인해 신뢰성과 통제가 중요함", "#FBE9C7", "#8F6500"],
    ["O", "Opportunity", "기업의 AI 전환 가속, 개인 비서형 AI 수요 증가, 산업별 특화 시장 확대", C.sky, "#255B90"],
    ["T", "Threat", "빅테크 경쟁 심화, 규제 강화, ROI 불확실 시 시장 조정 가능성", "#FCE5E3", "#A63E39"],
  ];

  for (let i = 0; i < swot.length; i += 1) {
    const left = 100 + i * 445;
    addShape(slide, { geometry: "roundRect", left, top: 620, width: 420, height: 280, fill: swot[i][3], line: swot[i][3] });
    addText(slide, {
      left: left + 28,
      top: 650,
      width: 48,
      height: 46,
      text: swot[i][0],
      textStyle: { fontSize: 46, color: swot[i][4], bold: true },
      fill: swot[i][3],
      line: swot[i][3],
    });
    addText(slide, {
      left: left + 82,
      top: 656,
      width: 230,
      height: 34,
      text: swot[i][1],
      textStyle: { fontSize: 24, color: swot[i][4], bold: true },
      fill: swot[i][3],
      line: swot[i][3],
    });
    addText(slide, {
      left: left + 28,
      top: 726,
      width: 350,
      height: 110,
      text: swot[i][2],
      textStyle: { fontSize: 22, color: C.ink },
      fill: swot[i][3],
      line: swot[i][3],
    });
  }
}

function addConclusionSlide(p) {
  const slide = p.slides.add();
  addSlideBackground(slide, C.navy);
  addShape(slide, { left: 112, top: 102, width: 1696, height: 876, fill: C.navy2, line: C.navy2 });

  addText(slide, {
    left: 180,
    top: 170,
    width: 220,
    height: 34,
    text: "최종 평가",
    textStyle: { fontSize: 30, color: C.teal, bold: true },
    fill: C.navy2,
    line: C.navy2,
  });
  addText(slide, {
    left: 180,
    top: 230,
    width: 820,
    height: 230,
    text: "에이전틱 AI는\n'생성형 AI의 다음 단계'이자\n실행 가능한 자비스로 가는 길입니다.",
    textStyle: { fontSize: 58, color: C.white, bold: true, lineSpacing: 1.05 },
    fill: C.navy2,
    line: C.navy2,
  });
  addText(slide, {
    left: 182,
    top: 505,
    width: 760,
    height: 140,
    text: "내 프로젝트와 직접 연결되며, 기술적 깊이와 사업화 가능성을 함께 설명할 수 있다는 점에서 발표 주제로 매우 적합합니다.",
    textStyle: { fontSize: 28, color: "#D9E5F0" },
    fill: C.navy2,
    line: C.navy2,
  });

  const summary = [
    ["성장 가능성", "매우 높음", "업무 자동화와 기업용 AI 시장의 핵심 축으로 성장 중"],
    ["투자 가치", "높지만 선별적 접근 필요", "화제성보다 실제 성과를 입증하는 업무 영역이 중요"],
    ["선택 이유", "자비스 프로젝트와 직접 연결됨", "내 경험과 산업 트렌드를 함께 설명할 수 있는 주제"],
    ["한 줄 결론", "개발연구 · 서비스혁신 · 중기연구", ""],
  ];

  for (let i = 0; i < summary.length; i += 1) {
    const top = 180 + i * 170;
    addShape(slide, { geometry: "roundRect", left: 1100, top, width: 560, height: 152, fill: C.white, line: C.white });
    addText(slide, {
      left: 1132,
      top: top + 20,
      width: 180,
      height: 28,
      text: summary[i][0],
      textStyle: { fontSize: 26, color: C.coral, bold: true },
      fill: C.white,
      line: C.white,
    });
    addText(slide, {
      left: 1132,
      top: top + 56,
      width: 420,
      height: 44,
      text: summary[i][1],
      textStyle: { fontSize: i === 3 ? 36 : 38, color: C.ink, bold: true },
      fill: C.white,
      line: C.white,
    });
    if (summary[i][2]) {
      addText(slide, {
        left: 1132,
        top: top + 106,
        width: 410,
        height: 28,
        text: summary[i][2],
        textStyle: { fontSize: 22, color: C.muted },
        fill: C.white,
        line: C.white,
      });
    }
  }

  addText(slide, {
    left: 182,
    top: 940,
    width: 160,
    height: 26,
    text: "감사합니다",
    textStyle: { fontSize: 24, color: "#B7CBDB", bold: true },
    fill: C.navy2,
    line: C.navy2,
  });
}

function buildPresentation() {
  const p = Presentation.create({ slideSize: { width: WIDTH, height: HEIGHT } });
  addCoverSlide(p);
  addConceptSlide(p);
  addPortfolioSlide(p);
  addTrendSlide(p);
  addBusinessSlide(p);
  addConclusionSlide(p);
  return p;
}

async function renderPreviews(presentation) {
  const previews = [];
  for (let i = 0; i < presentation.slides.items.length; i += 1) {
    const slide = presentation.slides.items[i];
    const canvas = new Canvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");
    await drawSlideToCtx(slide, presentation, ctx);
    const previewPath = path.join(scratchDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
    await canvas.toFile(previewPath);
    previews.push(previewPath);
  }
  return previews;
}

async function main() {
  const presentation = buildPresentation();
  const pptxBlob = await PresentationFile.exportPptx(presentation);
  const pptxPath = path.join(outputDir, "output.pptx");
  await pptxBlob.save(pptxPath);
  const previews = await renderPreviews(presentation);

  fs.writeFileSync(
    path.join(scratchDir, "preview-paths.json"),
    `${JSON.stringify({ pptx: pptxPath, previews }, null, 2)}\n`,
    "utf8",
  );

  console.log(JSON.stringify({ pptx: pptxPath, previews }, null, 2));
}

await main();
