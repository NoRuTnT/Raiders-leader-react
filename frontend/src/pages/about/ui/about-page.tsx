import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Github, Mail } from "lucide-react";

const sections = [
  {
    title: "■ Tech Stack.",
    content: `Java
기본 Java문법에 능숙하며 프로젝트에 알맞게 초기설정 및 환경구성이 가능합니다.
클린코드원칙과 유지보수성을 고려하여 도메인중심의 패키지구조를 설계하며 계층을 명확히 분리해 코드의 응집도와 가독성을  높였습니다. 또한 공통적으로 사용되는 기능은 별도 모듈로 분리하여 관리해 유지보수성을 강화했습니다.
Junit을 단위 테스트를 통해 주요 비즈니스 로직을 검증하는 테스트 주도 개발을 경험했습니다.
에이전트를 활용한 개발흐름 및 md문서 구조화를 통한 Harness Engineering을 학습하고 있습니다.

Infra / DevOps
   (Docker, Nginx, Jenkins, Linux, n8n, MCP server, Kubernetes)
다양한 기업의 인프라 운영사례를 분석하며 모니터링과 HA구조를 학습했고 이를 디스코드봇 서비스에 적용했습니다.  
서버마다 반복적인 인프라구성 대신 Ansible 기반 IaC 자동화환경을 구축하여 사용하고있습니다.
AWS와 Oracle Cloud 환경을 활용해 서비스를 운영했지만 지속적인비용과 자원활용 측면을 고려해 홈서버 환경을 직접 구축해 병행사용하고 있습니다. 이를통해 운영비용을 크게 절감하면서도 안정적인 서비스환경을 유지했습니다.
n8n을 활용해 업무 자동화환경을 구성해 실제로 활용하고 있습니다. 팀회의 보이스를 AI로 요약해 정해진 형식에 맞게 Notion 문서로 자동정리하는 흐름을 만들었고 메신저에서 하루동안의 대화내용을 요약해 기록으로 저장하는 파이프라인을 구축했습니다.
MCP서버를 구축해 허용된 함수만 호출하도록 제한하고 로그와 메트릭 데이터를 LLM기반 자연어로 탐색할 수 있는 운영환경을 구현해 사용하고 있습니다.     

Data
   (Kafka, Kafka Connect, FastApi, MySQL, ClickHouse, Redis)
사용자 10~20명이 사용하는 서비스 환경에서 월 2만건 수준의 서비스로그를 처리했습니다. 데이터를 안정적으로 처리하기 위해 Kafka와 KafkaConnect 기반 파이프라인을 설계하고 예상 TPS를 기준으로 파티션을 구성했습니다.
트랜잭션 처리를 담당하는 MySQL과 로그조회 및 분석에 특화된 ClickHouse를 분리하여 사용함으로써 서비스데이터와 로그데이터를 목적에 맞게 관리할 수 있는 구조를 구성했습니다.

Monitoring
   (Prometheus, Grafana, Loki, Promtail)
로그, 메트릭 통합 모니터링 환경을 구축하고 장애감지 및 알림자동화 시스템을 운영하고 있습니다.
운영자 관점(CPU, 디스크)과 사용자 서비스 관점(5xx error rate, p95 latency)을 분리한 모니터링 대시보드를 구성했습니다.

Git
프로젝트의 형상 관리를 위해 Git을 사용함에따라 협업 과정의 혼선을 줄이기 위해 상황별 Git 사용법을 습득했습니다.
깃 브랜치 전략과 행동강령을 정한 뒤 팀원들에게 설명하고 프로젝트에 적용한 경험이 있습니다.
많은사람들이 사용하는 kafka-ui 깃허브 프로젝트의 yml파일에서 broker.id 설정오류를 발견하고 issue를 생성한 뒤 PR을 올려 기여를 했습니다.`,
  },
  {
    title: "■ Education.",
    content: `2023.08 ~ 2024.06   삼성청년 SW 아카데미 10기 
2016.03 ~ 2023.08    한양대학교ERICA 분자생명과학과 (주전공)
2016.03 ~ 2023.08    한양대학교ERICA 신산업소프트웨어학과 (복수전공)`,
  },
  {
    title: "■ Activity.",
    content: `삼성청년SW아카데미 10기 - 2023.07 - 2024.06

Java 프로그래밍 역량 향상
Algorithmic Problem Solving 역량 향상
FE, BE, Infra 다양한 포지션으로 프로젝트를 진행하며 커뮤니케이션 역량향상
작업 분배와 코드 스타일을 맞추기 위한 팀원과의 컨벤션 논의 경험
Backend리더 포지션으로 다양한 돌발상황에 대처하며 기한내에 프로젝트를 완성한 경험`,
  },
  {
    title: "■ Awards / Certificates.",
    content: `2024.02     삼성청년sw아카데미 공통프로젝트 우수상
NAVER Cloud Platform Certified Associate
ADsP
SQLD
정보처리기사`,
  },
  {
    title: "■ Study.",
    content: `Algorithm Study
🔗 Git Hub: https://github.com/NoRuTnT/Algorithm-Study/tree/main
스터디원으로 참여, 총 4인
2023.08.30 ~ 2024.05.02 (9개월)
삼성청년SW아카데미 교육생들과 함께 알고리즘 문제를 풀이하고 발표
ComputerScience Study
🔗 Git Hub: https://github.com/NoRuTnT/cs-study
스터디원으로 참여, 총 6인
2023.08.01 ~ 2024.02.14 (6개월)
매일 아침 8시에 삼성청년SW아카데미 교육생들과 함께 CS 지식을 정리하고 돌아가며 발표`,
  },
];

const projects = [
  {
    title: "Discord bot  2025.01 - 운영중",
    images: [
      "/portfolio/discord-bot-architecture.png",
      "/portfolio/discord-bot-log-analysis.png",
      "/portfolio/discord-bot-analysis-result.png",
      "/portfolio/discord-bot-summary.png",
      "/portfolio/discord-bot-image-generation.png",
      "/portfolio/discord-bot-chat.png",
      "/portfolio/discord-bot-stock.png",
    ],
    content: `🔗  Git Hub: https://github.com/NoRuTnT/discord_bot    🔗 LoRA모델 학습과정: https://velog.io/@moonabcd/StableDiffusion-%ED%8A%B8%EB%A6%AD%EC%BB%AC-%EC%8A%A4%ED%83%80%EC%9D%BC-LoRA%EB%AA%A8%EB%8D%B8%EC%A0%9C%EC%9E%91
Overview.
<라라봇>은 메신저플랫폼에서 다양한 기능을 사용할 수 있도록 사용자의 경험을 확장시키는 서비스입니다.
Tech Stack.
Spring Boot | JDA | React
Stable Diffusion | FastAPI  
MySQL | Clickhouse
Nginx | Jenkins | Docker | Grafana | Promtail | Loki | Prometheus | n8n 
Key Points.
기획부터 개발, 배포까지 전 과정을 진행하며 서비스를 지속적으로 운영하는 경험
실제 사용자 의견을 반영하여 지속적으로 서비스를 개선하고 업데이트하는 과정
로그수집 파이프라인과 통합 모니터링환경을 구축해 서비스 운영안정성 향상
Experience and Learning.
Stable Diffusion LoRA 모델 학습 및 서비스 구현
기본 이미지 생성 모델만으로는 원하는 서비스를 안정적으로 재현하기 어렵다고 판단하여 특정 스타일 데이터를 기반으로
           LoRA 모델을 직접 학습하고 서비스에 적용했습니다.
FastAPI 기반으로 모델을 이미지 생성 모델을 서빙하여 Discord Bot과 연동하고 이미지 생성 요청을 비동기적으로
           처리할 수 있는 구조를 설계했습니다.
Kafka 기반 서비스로그 처리
기존의 서비스로그를 단일DB에서 처리할 경우 실시간 이벤트 증가에 따른 저장부하와 분석지연이 발생할 수 있다고
           판단했습니다. 이를 해결하기위해 서비스이벤트를 Kafka 기반으로 비동기처리하는 구조를 설계하고 로그 적재과정과
           서비스 로직을 분리하여 확장성과 장애 대응성을 높였습니다.
단순 운영데이터와 대용량 로그데이터의 성격이 다르다고 판단하여 트랜잭션 처리용 DB와 로그분석용 저장소를 분리했습니다.
           로그저장에는 대량 데이터적재와 조회에 강점이 있는 ClickHouseDB를 적용하고 Kafka Engine을 활용해 topic 데이터를
           실시간으로 적재하도록 구성했습니다.
DB 성능 최적화 및 백업 및 복원 검증 경험
서비스 데이터가 증가하는 환경에서 조회쿼리 성능저하 가능성을 고려하여 테스트환경에서 50만건 이상의 더미데이터를
          생성하여 시나리오별 쿼리실행계획을 분석했습니다. 조회 조건에 맞는 복합인덱스를 설계하고 적용 전후 성능차이를 비교하여
          응답시간을 1.236sec → 0.891sec로 개선했습니다.
운영 안정성을 높이기 위해 MySQL Docker 환경에서 백업 자동화 스크립트를 작성하고 복원테스트를 수행했습니다.
스케쥴링 관리 서비스 개발
외부 API 데이터를 수집가공하여 React 기반 웹대시보드에서 일정과 상태를 한눈에 확인할 수 있도록 구성했습니다.
사용자 입장에서 필요한 정보를 빠르게 확인할 수 있도록 시각적 상태 표현과 UI 흐름을 설계했으며 실시간 데이터 기반으로
          스케줄을 효율적으로 관리할 수 있는 환경을 구축했습니다.
Growth Points.
AI 모델 학습 및 서비스화 경험
원하는 결과를 안정적으로 생성하기 위해 LoRA 모델을 직접 학습하고 적용 강도 및 프롬프트를 반복적으로 튜닝하며
           최적화 과정을 경험했습니다.
대규모 트래픽을 고려한 서비스 설계 역량 고도화
로그 데이터 증가에 따른 처리 병목 가능성을 고려하여 Kafka 기반 이벤트 아키텍처를 설계하고 토픽 및 파티션 수를 검토하며
          장기적인 확장성을 고려한 Kafka 클러스터 구조를 구성했습니다.
초기에는 ClickHouse Kafka Engine에서 JSON 데이터를 직접 파싱하도록 구성했지만 데이터 적재 과정에서 저장소가
          변환책임까지 함께 수행하는 구조가 확장성 측면에서 비효율적이라고 판단했습니다. 이에 Kafka Connect Sink 단계에서
          데이터를 사전가공하도록 변경하여 데이터 변환 책임과 저장 책임을 분리했고 ClickHouse는 로그적재와 분석에 집중할 수
          있도록 구조를 개선했습니다.
1년간의 서비스운영 경험
서버 인프라구성부터 백엔드, 프론트엔드 UI까지 직접 개발하며 End-to-End 형태의 서비스를 구축하고 운영했습니다.
기능확장과 유지보수를 고려한 모듈화 구조를 설계했으며 실제 사용자 피드백을 반영해 기능과 UI를 지속적으로 개선했습니다.
운영자와 사용자 관점에서 서비스를 지속적으로 모니터링하며 장애 원인을 분석하고 대응하는 경험을 쌓았으며
          안정적인 서비스 운영을 위해 로그, 메트릭 기반의 모니터링환경도 함께 구축했습니다.`,
  },
  {
    title: "조심횡  2024.04 - 2024.05",
    images: [
      "/portfolio/becareful-architecture.png",
      "/portfolio/becareful-app-screens.png",
    ],
    content: `🔗  Git Hub: https://github.com/NoRuTnT/becareful
Overview.
<조심횡>은 시각장애인들의 안전한 교차로 보행을 위한 알림서비스 앱 입니다.
Project Team.
Backend, Infra 담당 | Android(2) Backend(2) Infra(1)
Tech Stack.
Spring Boot | Kafka Connect | S3 | MySQL | firebase | Nginx | Jenkins | Docker | plg Stack | Prometheus
Key Points.
기획/개발/배포/현장테스트에 참여하며 6주 개발 목표 달성
멀티모듈 프로젝트를 구성함으로서 팀원들이 코드를 효율적으로 구성하고 관리할 수 있도록 설계
신호데이터의 확장성을 고려해 설계한 Kafka Connect 실시간 데이터 파이프라인 구축 
Experience and Learning.
멀티모듈 기반 프로젝트 구조 설계
ShadowJar를 활용해 모듈별 의존성을 명확하게 관리하고 공통기능과 서비스로직의 책임을 분리하여 유지보수성과
          확장성을 높였습니다.
Custom Kafka Connect pipline 구현
실시간 교통 데이터를 여러 외부 API로부터 수집해야 하는 환경에서 데이터 형식차이와 병합처리의 복잡성을 해결하기 위해
           Kafka Connect 기반 데이터 파이프라인을 설계했습니다.
Java 기반의 Custom Source Connector와 Sink Connector를 직접 구현했으며 다양한 형태의 데이터를 안정적으로
           처리할 수 있도록 구성했습니다.
PLG stack기반 모니터링 환경 구축
서비스 운영 중 발생하는 이슈를 빠르게 파악하고 팀원들과 공유할 수 있도록 Promtail-Loki-Grafana-Prometheus 기반
           모니터링 환경을 구축했습니다.
Spring Backend와 Kafka 클러스터 로그를 중앙화하여 운영 데이터를 통합 관리하고 로그기반으로 장애원인을 빠르게 
          추적할 수 있는 환경을 구성했습니다.
서버 메트릭 수집과 Alertmanager 기반 메신저 알림 시스템을 연동하여 장애상황을 실시간으로 감지하고 대응할 수 있도록
           구성했으며 이를 통해 서비스 안정성과 운영 가시성을 높였습니다.
Growth Points.
첫 오픈소스 기여 경험
kafka-ui github의 코드의 문제점을 발견하여 적절한 Issue를 생성한뒤 수정 및 기여하는과정을 처음 진행했습니다.
이를 통해 대규모 프로젝트에서 체계적인 코드기여 과정을 직접 경험하고 스스로 Pull ReQuest를 올리기 전에 
          많은 테스트를 진행하여 프로젝트에 추가되는 코드의 책임감을 느낄 수 있었습니다.
kafka 실시간 데이터 파이프라인 구축 역량 강화
Schema Registry를 통해 데이터 구조를 버전으로 관리하여 장애 없이 스키마 변경이 가능한 데이터 파이프라인구조를
          설계했습니다.
프로젝트에서 여러 토픽의 병합 요구가 발생함에 따라 Kafka Streams를 학습하며 스트림 병합 및 처리 아키텍처에 대한
          이해를 확장했습니다.
프로젝트를 위해 한국 Kafka 커뮤니티에서 활동하며 정보를 얻었으며 이후로도 꾸준히 운영사례를 학습하고있습니다.`,
  },
  {
    title: "스물다섯 여든하나  2024.02 - 2024.03",
    images: [
      "/portfolio/tfeo-architecture.png",
      "/portfolio/tfeo-start.png",
      "/portfolio/tfeo-matching.png",
      "/portfolio/tfeo-contract.png",
    ],
    content: `🔗  Git Hub: https://github.com/NoRuTnT/TFEO
Overview.
<스물다섯 여든하나>는 추천기반 대학생-독거노인 주거공유서비스 앱 입니다.
Project Team.
Backend, Infra 담당 | Frontend(1) Fullstack(4) Infra(1)
Tech Stack.
Spring Boot | FastAPI | MongoDB | MySQL | Redis | Nginx | Docker | Prometheus | Grafana
Key Points.
효율적인 데이터 스트림 처리를 위해 FastAPI 데이터파이프라인 구성
컨텐츠기반 필터링을 통한 맞춤 집 추천
계약서 생성 자동화
Experience and Learning.
Jenkins 기반 CI 파이프라인 구축
코드 변경사항이 메인 브랜치에 병합되기 전에 잠재적인 오류를 사전에 검증하고 안정적인 배포품질을 유지하기 위해
           Jenkins기반 Pre-build 파이프라인을 구축했습니다.
빌드 및 테스트 과정을 자동화하여 문제를 조기에 발견할 수 있도록 구성했으며 이를 통해 반복적인 수동 검증부담을 줄이고
           협업 과정에서 코드 품질을 안정적으로 관리할 수 있었습니다.
Nginx, Docker, Jenkins기반 Blue-Green 무중단 배포 구현
서비스 운영 중 기능 배포 과정에서 발생할 수 있는 서비스중단과 사용자불편을 최소화하기 위해 Blue-Green 기반 
           무중단 배포 환경을 구축했습니다.
새로운 버전의 애플리케이션을 Docker 컨테이너로 별도 배포한 뒤 Jenkins 파이프라인을 통해 테스트 및 헬스체크를
          수행하고 안정성이 확인된 경우에만 Nginx 트래픽을 신규 환경으로 전환하도록 구성했습니다.
배포 완료 후 기존환경을 정리하는 과정까지 자동화하여 운영자의 반복작업을 줄이고 안정적인 배포 프로세스를 구축했습니다.
Growth Points.
프로젝트 인프라 전반 구축과 DevOps 이해
프로젝트 초기단계에서 CI/CD 자동화, 서버 환경 구성, Docker 기반 배포 구조까지 인프라 전반을 직접 구축하며
           팀원들이 빠르게 개발에 집중할 수 있는 환경을 조성했습니다.
반복 작업 자동화와 안정적인 배포 환경 구축이 서비스 품질과 팀 생산성에 큰 영향을 준다는 점을 체감했으며 서비스 운영과
           배포 안정성까지 함께 고려하는 DevOps 관점을 학습할 수 있었습니다.`,
  },
  {
    title: "Dotori  2024.01 - 2024.02",
    images: [
      "/portfolio/dotori-library.png",
      "/portfolio/dotori-create-room.png",
      "/portfolio/dotori-waiting-room.png",
      "/portfolio/dotori-stage.png",
    ],
    content: `🔗  Git Hub: https://github.com/NoRuTnT/Dotori
Overview.
<Dotori>는 아이들을 위한 동화책 연극 서비스 입니다.
Project Team.
Fullstack 담당 | Fullstack(6) 
Tech Stack.
Spring Boot | OpenVidu | Media Pipe | S3 | MySQL | Nginx | Jenkins | Docker
Key Points.
openvidu로 연결된 비디오에 3d이미지 탈 적용
방에서의 각 사용자의 상태관리
Experience and Learning.
SpringSecurity를 활용한 OAuth2.0 인증/인가 구현
다양한 클라이언트 환경에서 안전한 사용자 인증과 권한 관리를 제공하기 위해 Spring Security 기반
           OAuth2 인증/인가 구조를 구현했습니다.
Access Token과 Refresh Token의 역할을 분리하고 Redis를 활용해 Refresh Token을 저장, 관리함으로써
          빠른 토큰 검증과 세션 관리를 가능하도록 구성했습니다.
Redis TTL 기능을 활용하여 만료된 토큰이 자동으로 제거되도록 설계해 인증 데이터 관리 부담을 줄였습니다.
사용자 경험을 고려한 인증 흐름 개선
사용자가 토큰 만료로 인해 서비스 이용이 중단되지 않도록 Refresh Token 기반 자동 재발급 구조를 구현했습니다.
새로운 Access Token이 발급되는 동안에도 사용자 세션과 애플리케이션 상태가 유지되도록 구성하여
           인증 갱신 과정이 사용자 경험에 영향을 주지 않도록 설계했습니다.
JWT 보안 강화 및 클라이언트 관리 부담 최소화
JWT를 HttpOnly Cookie에 저장하여 클라이언트 측 스크립트에서 직접 접근할 수 없도록 구성했습니다.
브라우저가 쿠키를 자동으로 전송하도록 설계하여 클라이언트에서 토큰 저장 및 관리 로직을 최소화했고
           이를 통해 XSS 기반 토큰 탈취 위험을 줄이며 인증 처리 안정성을 높였습니다.
Blender 활용 3D 아바타 커스터마이징
서비스 내 동화책 캐릭터 아바타 기능 구현을 위해 Blender를 활용하여 3D 아바타 모델을 수정했습니다.
Shape Key를 적용해 리깅된 아바타에 자연스러운 움직임을 부여할 수 있도록 구성했으며 개발 과정에서
           서비스 기능 구현을 위해 새로운 툴을 빠르게 학습하고 적용하는 경험을 쌓았습니다.
Growth Points.
git 과 Jira를 활용한 체계적인 프로젝트 관리
프로젝트 진행 과정에서 Git 브랜치 전략과 협업 규칙을 정의하고 팀원들과 공유하며 체계적인 형상 관리 환경을 구축했습니다.
Jira를 활용해 작업 단위를 이슈 기반으로 관리하고 우선순위 및 진행 상태를 명확하게 공유함으로써 협업 과정의 혼선을
           줄이고 프로젝트 진행 상황을 효율적으로 관리했습니다.`,
  },
];

const subheadings = new Set([
  "Java", "Infra / DevOps", "Data", "Monitoring", "Git", "Algorithm Study", "ComputerScience Study",
  "삼성청년SW아카데미 10기 - 2023.07 - 2024.06",
  "Overview.", "Project Team.", "Tech Stack.", "Key Points.", "Experience and Learning.", "Growth Points.",
  "Stable Diffusion LoRA 모델 학습 및 서비스 구현", "Kafka 기반 서비스로그 처리",
  "DB 성능 최적화 및 백업 및 복원 검증 경험", "스케쥴링 관리 서비스 개발",
  "AI 모델 학습 및 서비스화 경험", "대규모 트래픽을 고려한 서비스 설계 역량 고도화",
  "1년간의 서비스운영 경험", "멀티모듈 기반 프로젝트 구조 설계", "Custom Kafka Connect pipline 구현",
  "PLG stack기반 모니터링 환경 구축", "첫 오픈소스 기여 경험",
  "kafka 실시간 데이터 파이프라인 구축 역량 강화", "Jenkins 기반 CI 파이프라인 구축",
  "Nginx, Docker, Jenkins기반 Blue-Green 무중단 배포 구현", "프로젝트 인프라 전반 구축과 DevOps 이해",
  "SpringSecurity를 활용한 OAuth2.0 인증/인가 구현", "사용자 경험을 고려한 인증 흐름 개선",
  "JWT 보안 강화 및 클라이언트 관리 부담 최소화", "Blender 활용 3D 아바타 커스터마이징",
  "git 과 Jira를 활용한 체계적인 프로젝트 관리",
]);

function normalizeLines(content: string) {
  const result: string[] = [];
  for (const sourceLine of content.split("\n")) {
    const line = sourceLine.trim();
    if (!line) continue;
    if (/^\s{2,}/.test(sourceLine) && !line.startsWith("(") && result.length > 0) result[result.length - 1] += ` ${line}`;
    else result.push(line);
  }
  return result;
}

function tidySpacing(text: string) {
  const replacements: [string, string][] = [
    ["사용하고있", "사용하고 있"], ["운영하고있", "운영하고 있"], ["학습하고있", "학습하고 있"],
    ["서비스로그", "서비스 로그"], ["서비스데이터", "서비스 데이터"], ["로그데이터", "로그 데이터"],
    ["모니터링환경", "모니터링 환경"], ["자동화환경", "자동화 환경"], ["데이터파이프라인", "데이터 파이프라인"],
    ["사용자불편", "사용자 불편"], ["배포품질", "배포 품질"], ["반복작업", "반복 작업"], ["초기단계", "초기 단계"],
  ];
  return replacements.reduce((result, [before, after]) => result.split(before).join(after), text);
}

function FormattedContent({ content }: { content: string }) {
  const groups: { heading?: string; items: string[] }[] = [];
  for (const line of normalizeLines(content)) {
    if (subheadings.has(line)) groups.push({ heading: line, items: [] });
    else {
      if (groups.length === 0) groups.push({ items: [] });
      groups[groups.length - 1].items.push(line);
    }
  }

  return <div className="space-y-6">
    {groups.map((group, index) => {
      const linkItems = group.items.filter((item) => /https?:\/\//.test(item));
      const bodyItems = group.items.filter((item) => !/https?:\/\//.test(item));
      return <div key={`${group.heading ?? "content"}-${index}`}>
      {group.heading ? <div className="mb-3 flex flex-wrap items-center gap-3"><h3 className="text-lg font-bold text-[#3f2b1a]">{group.heading}</h3>{linkItems.map((item) => <span key={item}>{renderLinkedText(item)}</span>)}</div> : null}
      {!group.heading && linkItems.length ? <div className="mb-3 flex flex-wrap gap-2">{linkItems.map((item) => <span key={item}>{renderLinkedText(item)}</span>)}</div> : null}
      <ul className="space-y-2.5">
        {bodyItems.map((item, itemIndex) => {
          const isStackLine = item.startsWith("(") && item.endsWith(")");
          return <li key={`${item}-${itemIndex}`} className={isStackLine ? "-mt-1 text-sm font-semibold leading-7 text-[#9a6a32]" : "flex gap-3 text-[15px] leading-7 text-[#59452f]"}>
            {isStackLine ? null : <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#b77a2d]" />}
            <span className="break-words">{renderLinkedText(tidySpacing(item))}</span>
          </li>;
        })}
      </ul>
    </div>})}
  </div>;
}

function renderLinkedText(text: string) {
  const urls = text.match(/https?:\/\/[^\s]+/g);
  if (!urls) return text;
  return <span className="flex flex-wrap gap-2">
    {urls.map((url) => {
      const label = url.includes("velog.io") ? "LoRA모델 학습과정" : "Git Hub";
      return <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[#d8bd8c] bg-white px-3 py-1 text-sm font-bold text-[#704920] transition hover:bg-[#f4e5c7]"><ExternalLink className="h-3.5 w-3.5" />{label}</a>;
    })}
  </span>;
}

function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;
  const move = (direction: -1 | 1) => setActiveIndex((current) => (current + direction + images.length) % images.length);

  return <div className="bg-white p-5 md:p-8">
    <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border border-[#ead9b9] bg-[#fafafa] p-3 md:min-h-[520px]">
      <img src={images[activeIndex]} alt={`${title} 프로젝트 이미지 ${activeIndex + 1}`} className="max-h-[620px] w-full object-contain" />
      {hasMultipleImages ? <>
        <button type="button" aria-label="이전 이미지" onClick={() => move(-1)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#4e351f]/85 text-white shadow-lg transition hover:bg-[#4e351f]"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" aria-label="다음 이미지" onClick={() => move(1)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#4e351f]/85 text-white shadow-lg transition hover:bg-[#4e351f]"><ChevronRight className="h-5 w-5" /></button>
        <span className="absolute bottom-3 right-3 rounded-full bg-[#4e351f]/85 px-3 py-1 text-xs font-bold text-white">{activeIndex + 1} / {images.length}</span>
      </> : null}
    </div>
    {hasMultipleImages ? <div className="mt-4 flex justify-center gap-2">{images.map((image, index) => <button key={image} type="button" aria-label={`${index + 1}번 이미지 보기`} onClick={() => setActiveIndex(index)} className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-7 bg-[#704920]" : "w-2.5 bg-[#d8bd8c] hover:bg-[#b88b51]"}`} />)}</div> : null}
  </div>;
}

export function AboutPage() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-7 pb-16">
      <section className="overflow-hidden rounded-[34px] border border-[#e7d5b2] bg-[#fffaf0] shadow-[0_24px_70px_rgba(120,86,36,.08)]">
        <div className="grid lg:grid-cols-[360px_1fr]">
          <div className="flex min-h-[360px] items-center justify-center bg-white p-7 md:p-10"><img src="/portfolio/profile-developer.png" alt="노트북으로 개발하는 사슴 프로필" className="max-h-[380px] w-full object-contain" /></div>
          <div className="p-7 md:p-11">
            <p className="text-lg font-semibold text-[#a36c28]">홈서버를 활용해 자유로운 학습을 추구하는 개발자</p>
            <h1 className="mt-4 text-5xl font-bold text-[#3f2b1a]">문준형</h1>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a href="mailto:moonabcd@naver.com" className="inline-flex items-center gap-2 rounded-full bg-[#5f4124] px-4 py-2.5 font-semibold text-white"><Mail className="h-4 w-4" />📧 E-mail(moonabcd@naver.com)</a>
              <a href="https://velog.io/@moonabcd/posts" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#d8bd8c] px-4 py-2.5 font-semibold"><ExternalLink className="h-4 w-4" />🔗 Blog</a>
              <a href="https://github.com/NoRuTnT" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#d8bd8c] px-4 py-2.5 font-semibold"><Github className="h-4 w-4" />🔗 Git Hub</a>
            </div>
            <div className="mt-8"><FormattedContent content={`개발에 몰입할 수 있는 환경을 유지하기 위해 꾸준한 학습을 유지해왔습니다.
테스트를 통해 오픈소스를 개선해 본 경험이 있습니다. 항상 오픈소스를 이해하며 사용하려고 노력합니다.
학습한 기술을 타인과 공유하는 것을 좋아합니다. 타인과 지식 공유를 통해 커뮤니케이션 및 기술 역량을 키우고 있습니다.
kafka한국사용자모임활동, Geeknews 구독을 통해 지속적으로 기술적흐름을 따라가려고 노력하고있습니다.
사이드 프로젝트로 디스코드 봇을 운영하고 있습니다.`} /></div>
          </div>
        </div>
      </section>

      {sections.map((section) => <section key={section.title} className="rounded-[30px] border border-[#e7d5b2] bg-[#fffaf0] p-7 md:p-10"><h2 className="text-3xl font-bold text-[#3f2b1a]">{section.title}</h2><div className="mt-7"><FormattedContent content={section.content} /></div></section>)}

      <section><h2 className="mb-6 text-4xl font-bold text-[#3f2b1a]">■ Project.</h2><div className="space-y-5">{projects.map((project, index) => {
        const projectLinks = normalizeLines(project.content).filter((line) => /https?:\/\//.test(line));
        const projectBody = normalizeLines(project.content).filter((line) => !/https?:\/\//.test(line)).join("\n");
        return <details key={project.title} className="group overflow-hidden rounded-[30px] border border-[#e7d5b2] bg-[#fffaf0]" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-7 md:px-10"><div className="flex flex-wrap items-center gap-3"><h3 className="text-2xl font-bold text-[#3f2b1a]">{project.title}</h3>{projectLinks.map((item) => <span key={item} onClick={(event) => event.stopPropagation()}>{renderLinkedText(item)}</span>)}</div><span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#8a6233]"><span className="hidden sm:inline">내용 보기</span><ChevronDown className="h-5 w-5 transition-transform duration-200 group-open:rotate-180" /></span></summary><div className="border-t border-[#ead9b9]"><ProjectGallery images={project.images} title={project.title} /><div className="p-7 md:p-10"><FormattedContent content={projectBody} /></div></div></details>;
      })}</div></section>

      <section className="rounded-[30px] border border-[#e7d5b2] bg-[#fffaf0] p-7 md:p-10"><h2 className="text-3xl font-bold text-[#3f2b1a]">■ Current Interests.</h2><figure className="mt-7 overflow-hidden rounded-2xl border border-[#ead9b9] bg-white p-3 md:p-5"><img src="/portfolio/current-interests-mlops-architecture.png" alt="데이터 수집부터 학습, 배포, 모니터링까지 연결한 End-to-End MLOps 아키텍처" className="h-auto w-full object-contain" /></figure><div className="mt-7"><FormattedContent content={`서비스를 운영하며 데이터 파이프라인과 모니터링 환경을 구축하면서 모델을 배포하는 것으로 끝나는 것이 아니라 데이터 수집부터
      학습, 배포, 모니터링까지 하나의 파이프라인으로 연결되어야 한다는 점을 느꼈습니다.
최근에는 이러한 DevOps 경험을 확장하기 위해 AI서비스 환경을 가정한 End-to-End MLOps아키텍처를 직접 설계하며
      관련 기술을 학습하고 있습니다.`} /></div></section>
    </div>
  );
}
