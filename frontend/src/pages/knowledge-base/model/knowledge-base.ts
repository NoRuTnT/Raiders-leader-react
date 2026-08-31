export interface KnowledgeBaseArticle {
  id: string;
  category: "Networking" | "Storage" | "Database" | "Container" | "DevOps" | "Data" | "Observability" | "Backend";
  title: string;
  description: string;
  keywords: string[];
  parentId?: string;
  sections: { title: string; description: string; bullets: string[] }[];
}

export interface ScpServiceContext {
  description: string;
  bullets: string[];
  referenceUrl: string;
}

export const knowledgeCategories = ["Networking", "Storage", "Database", "Container", "DevOps", "Data", "Observability", "Backend"] as const;

interface ArticleDetail {
  overviewBullets: string[];
  operationDescription: string;
  operationBullets: string[];
  designDescription: string;
  designBullets: string[];
}

const scpPrerequisites: Record<string, { description: string; bullets: string[] }> = {
  "internet-gateway": { description: "SCP VPC 문서에서 Internet Gateway는 VPC에 생성·연결하는 구성 요소로 설명합니다.", bullets: ["필요한 기반: VPC", "인터넷 공개가 필요한 자원에는 별도로 Public IP를 지정하거나 Public Load Balancer를 구성해야 합니다."] },
  "nat-gateway": { description: "SCP 문서가 명시한 NAT Gateway 생성 조건입니다.", bullets: ["필요한 기반: VPC와 General 타입 Subnet", "선행 구성: Internet Gateway를 먼저 생성하여 VPC에 연결"] },
  "vpc-peering": { description: "SCP에서 VPC Peering은 두 VPC 사이의 1:1 사설 통신 경로입니다.", bullets: ["필요한 기반: 연결할 두 VPC", "동일 Account 간 연결을 기본으로 제공하며 다른 Account 간 연결은 문서에 명시된 제약을 확인해야 합니다."] },
  "vpc-endpoint": { description: "SCP VPC Endpoint는 전용 Subnet을 사용하는 VPC 구성 요소입니다.", bullets: ["필요한 기반: VPC와 VPC Endpoint Subnet", "접근 대상 SCP 서비스 및 외부 네트워크의 Private 연결 구성"] },
  firewall: { description: "SCP Firewall 공식 문서가 선행 서비스로 명시한 항목입니다.", bullets: ["VPC", "Direct Connect", "Load Balancer"] },
  "load-balancer": { description: "SCP Load Balancer 공식 문서가 명시한 선행 서비스입니다.", bullets: ["VPC"] },
  vpn: { description: "SCP VPN 공식 문서가 명시한 선행 서비스입니다.", bullets: ["VPC"] },
  "block-storage": { description: "일반 VM용 SCP Block Storage 공식 문서가 명시한 선행 서비스입니다.", bullets: ["Virtual Server"] },
  "file-storage": { description: "SCP File Storage 공식 문서가 명시한 선행 서비스입니다.", bullets: ["Virtual Server", "Bare Metal Server"] },
  backup: { description: "SCP Backup 공식 문서가 명시한 선행 서비스입니다.", bullets: ["Virtual Server", "Bare Metal Server"] },
  mysql: { description: "SCP MySQL(DBaaS) 공식 문서가 명시한 선행 서비스입니다.", bullets: ["VPC"] },
  redis: { description: "SCP CacheStore(DBaaS) 공식 문서가 명시한 선행 서비스입니다.", bullets: ["VPC"] },
  kubernetes: { description: "SCP Kubernetes Engine 공식 문서가 명시한 선행 서비스입니다.", bullets: ["VPC", "Security Group", "File Storage — Persistent Volume으로 활용"] },
};

const articleDetails: Record<string, ArticleDetail> = {
  vpc: {
    overviewBullets: ["VPC는 주소 공간(CIDR), Subnet, Route, 보안 정책을 묶어 워크로드의 네트워크 경계를 만듭니다.", "하나의 계정에서도 운영·개발·공용 서비스처럼 목적에 따라 여러 VPC를 분리할 수 있습니다.", "VPC를 만들었다고 외부 통신이 자동으로 열리지는 않으며 Gateway, Public IP, Route, 보안 규칙을 별도로 구성해야 합니다."],
    operationDescription: "패킷은 출발 자원이 속한 Subnet의 주소 범위와 라우팅 정책을 따라 다음 목적지로 전달됩니다. 같은 VPC 내부 통신, 인터넷 통신, 다른 VPC 또는 온프레미스 통신은 각각 다른 연결 요소를 사용합니다.",
    operationBullets: ["내부 통신은 VPC와 Subnet의 사설 IP 범위 안에서 이루어집니다.", "인터넷 통신은 Internet Gateway, Public IP NAT, NAT Gateway 같은 구성 요소의 역할을 구분해야 합니다.", "VPC Peering은 VPC 간 1:1 연결, Transit Gateway는 다수 네트워크의 허브 연결에 적합합니다."],
    designDescription: "VPC 설계의 핵심은 IP 주소를 넉넉하게 확보하면서도 연결할 다른 네트워크와 겹치지 않게 만드는 것입니다. 이후 서비스 계층별로 Subnet과 보안 경계를 나눕니다.",
    designBullets: ["향후 VPC Peering, VPN, Direct Connect를 고려해 온프레미스와 다른 VPC의 CIDR 중복을 피합니다.", "외부 진입 계층, 애플리케이션 계층, 데이터 계층을 분리하고 실제 필요한 흐름만 허용합니다.", "장애 분석 시 DNS → Route → Gateway → Firewall → Security Group → 애플리케이션 포트 순으로 경로를 확인합니다."]
  },
  subnet: {
    overviewBullets: ["Subnet은 VPC CIDR의 일부를 잘라 만든 더 작은 IP 주소 영역입니다.", "Public·Private이라는 성격은 이름이 아니라 실제 인터넷 경로, Public IP, NAT 구성에 의해 결정됩니다.", "서버·로드 밸런서·데이터베이스 같은 자원은 특정 Subnet에 배치되고 해당 범위의 사설 IP를 사용합니다."],
    operationDescription: "Subnet은 자원이 어느 네트워크 구역에 속하는지 결정합니다. 라우팅과 보안 정책은 이 경계를 기준으로 패킷의 다음 목적지와 허용 범위를 제어합니다.",
    operationBullets: ["CIDR의 네트워크 주소와 호스트 주소 범위가 Subnet의 수용 가능한 IP 수를 결정합니다.", "Private Subnet의 서버가 인터넷으로 나가려면 NAT 같은 별도 송신 경로가 필요합니다.", "같은 Subnet 또는 같은 VPC 안의 통신도 Security Group 규칙에 의해 차단될 수 있습니다."],
    designDescription: "Subnet은 단순한 IP 묶음이 아니라 장애 범위와 보안 영역을 나누는 설계 단위로 사용합니다.",
    designBullets: ["웹·애플리케이션·DB 계층을 분리하고 각 계층에 꼭 필요한 통신만 허용합니다.", "증설될 서버, 관리형 서비스가 소비하는 주소, Load Balancer의 서비스 IP를 고려해 주소를 여유 있게 배정합니다.", "SCP의 General, VPC Endpoint, Local Subnet은 일반적인 Public·Private 구분과 별개의 상품 유형이므로 공식 가이드의 제약을 확인합니다."]
  },
  "internet-gateway": {
    overviewBullets: ["Internet Gateway는 VPC와 공용 인터넷 사이에 경로를 제공하는 클라우드 네트워크 구성 요소입니다.", "Gateway 연결만으로 서버가 공개되지는 않으며 Public IP와 라우팅, 보안 규칙이 함께 필요합니다.", "외부에서 들어오는 흐름과 내부에서 나가는 흐름 모두 서비스의 보안 정책으로 제한해야 합니다."],
    operationDescription: "공인 주소로 도착한 트래픽은 Internet Gateway를 통해 VPC 내부 자원으로 전달되고, 응답은 반대 경로를 따라 나갑니다. 클라우드가 관리하는 논리적 Gateway이므로 사용자는 연결 대상과 정책에 집중합니다.",
    operationBullets: ["외부 공개 서버나 Load Balancer에는 인터넷에서 도달할 수 있는 Public IP가 필요합니다.", "Route가 존재해도 Security Group 또는 Firewall이 포트를 허용하지 않으면 연결되지 않습니다.", "내부 전용 서버는 직접 공인 주소를 부여하지 않고 Load Balancer나 NAT를 통해 필요한 방향의 통신만 구성합니다."],
    designDescription: "인터넷 경계는 공격 표면이므로 공개 자원 수와 허용 포트를 최소화하고 로그를 남길 수 있게 설계합니다.",
    designBullets: ["웹 진입점은 Load Balancer로 모으고 애플리케이션·DB 서버는 사설 주소만 사용하는 구성을 우선 검토합니다.", "관리 포트는 전체 인터넷에 열지 않고 VPN, Bastion, 허용된 관리망으로 출발지를 제한합니다.", "문제 발생 시 Public IP 연결, Route, Firewall, Security Group, 서버 리스닝 포트를 차례로 확인합니다."]
  },
  "nat-gateway": {
    overviewBullets: ["NAT Gateway는 사설 IP를 사용하는 자원이 인터넷으로 요청을 보낼 때 대표 공인 IP로 주소를 변환합니다.", "일반적으로 내부에서 시작한 연결의 응답은 돌아올 수 있지만 외부에서 임의로 새 연결을 시작하는 진입점으로 사용하지 않습니다.", "패키지 저장소 접근, 외부 API 호출처럼 서버의 아웃바운드 통신이 필요한 경우에 활용합니다."],
    operationDescription: "Private 자원의 패킷이 NAT Gateway로 전달되면 출발지 사설 IP와 포트가 Gateway의 공인 주소 정보로 변환됩니다. Gateway는 변환 상태를 기억해 응답 패킷을 원래 서버로 되돌립니다.",
    operationBullets: ["Private Subnet의 기본 경로 또는 필요한 목적지 경로가 NAT Gateway를 향해야 합니다.", "여러 서버가 하나의 대표 공인 IP를 사용하므로 외부 시스템의 IP 허용 목록 관리가 단순해질 수 있습니다.", "SCP에서는 General 타입 Subnet에 생성하며 Internet Gateway가 VPC에 먼저 연결되어 있어야 합니다."],
    designDescription: "NAT는 보안 장비 그 자체가 아니므로 아웃바운드 목적지 제한과 로그·비용·장애 영향을 별도로 고려합니다.",
    designBullets: ["모든 인터넷 통신을 허용하기보다 Firewall에서 필요한 목적지와 포트를 제한합니다.", "Gateway 장애나 처리량 한도가 여러 서버에 동시에 영향을 줄 수 있으므로 플랫폼의 가용성 방식과 모니터링 지표를 확인합니다.", "외부에서 서버로 들어와야 하는 서비스에는 NAT Gateway가 아니라 Public Load Balancer 등 적절한 인바운드 경로를 사용합니다."]
  },
  "vpc-peering": {
    overviewBullets: ["VPC Peering은 두 VPC가 공용 인터넷을 거치지 않고 사설 IP로 통신하도록 만드는 직접 연결입니다.", "연결을 생성한 것만으로 통신이 완성되지 않으며 양쪽의 Route와 보안 규칙을 설정해야 합니다.", "SCP 문서에서는 VPC 간 1:1 사설 경로를 제공한다고 정의합니다."],
    operationDescription: "각 VPC의 라우팅 정책에 상대 VPC CIDR의 다음 경로를 Peering 연결로 지정하면 패킷이 사설망을 통해 상대편으로 전달됩니다.",
    operationBullets: ["양쪽 CIDR이 겹치면 목적지 경로를 명확하게 선택할 수 없으므로 주소 중복을 피해야 합니다.", "Security Group 또는 Firewall은 상대 VPC의 실제 주소와 서비스 포트를 허용해야 합니다.", "일반적인 VPC Peering은 다른 Peering 연결로 트래픽을 중계하는 전이적 라우팅을 제공하지 않으므로 플랫폼 제약을 확인합니다."],
    designDescription: "소수 VPC의 단순한 1:1 연결에는 적합하지만 연결 수가 늘면 Route와 정책 관리가 복잡해집니다.",
    designBullets: ["환경별·조직별로 허용할 통신 목록과 책임자를 문서화합니다.", "다수 VPC와 온프레미스를 함께 연결해야 하면 Transit Gateway 같은 허브형 구조를 비교합니다.", "통신 장애 시 Peering 상태, 양방향 Route, 양방향 보안 규칙, CIDR 중복을 함께 확인합니다."]
  },
  "vpc-endpoint": {
    overviewBullets: ["VPC Endpoint는 인터넷에 서비스를 공개하지 않고 사설 네트워크 경로로 특정 서비스에 접근하기 위한 진입점입니다.", "일반적인 Endpoint 개념과 SCP의 VPC Endpoint Subnet·지원 서비스 범위는 구분해서 이해해야 합니다.", "Endpoint 사용 여부는 데이터 경로, 보안 요구사항, DNS 및 접근 정책에 영향을 줍니다."],
    operationDescription: "클라이언트는 Endpoint의 사설 주소 또는 전용 DNS 경로로 요청하고, 클라우드 내부 네트워크가 이를 대상 서비스로 전달합니다.",
    operationBullets: ["SCP는 VPC Endpoint 생성 용도의 별도 Subnet 유형을 제공합니다.", "Endpoint가 있어도 대상 서비스의 인증·권한 검사는 그대로 필요합니다.", "외부 네트워크에서 접근하는 경우 VPN 또는 Direct Connect 같은 Private 연결 경로와 DNS 해석 범위를 함께 점검합니다."],
    designDescription: "민감한 데이터가 오가는 서비스는 인터넷 경유를 줄이되, Endpoint가 지원하는 서비스와 접근 범위를 명확히 제한합니다.",
    designBullets: ["지원 상품, 리전, 주소 할당 방식은 SCP 공식 가이드에서 확인합니다.", "Public Endpoint와 Private Endpoint가 동시에 존재한다면 애플리케이션이 실제로 어느 주소를 사용하는지 검증합니다.", "DNS, Route, Security Group, 서비스 권한 중 어느 단계에서 차단되는지 구분할 수 있도록 접속 테스트를 설계합니다."]
  },
  "transit-gateway": {
    overviewBullets: ["Transit Gateway는 여러 VPC와 고객 네트워크를 중앙 허브에 연결하는 네트워크 중계 서비스입니다.", "VPC마다 Peering을 모두 연결하는 Full Mesh 구조의 연결 수와 운영 복잡도를 줄일 수 있습니다.", "SCP는 연결 구간별 독립적인 Firewall 구성과 라우팅 기능을 제공한다고 설명합니다."],
    operationDescription: "각 VPC 또는 외부 네트워크를 Attachment로 허브에 연결하고, Transit Gateway의 라우팅 정책이 목적지 네트워크에 맞는 Attachment를 선택합니다.",
    operationBullets: ["Hub-and-Spoke 구조에서 Spoke 간 통신 허용 여부를 중앙 Route와 Firewall 정책으로 결정합니다.", "라우팅 전파와 정적 Route의 우선순위, 왕복 경로의 대칭성을 확인해야 합니다.", "온프레미스 연결은 Direct Connect 또는 VPN과 결합될 수 있으므로 전체 경로의 MTU와 주소 중복도 검토합니다."],
    designDescription: "중앙 허브는 연결 관리를 단순화하지만 잘못된 Route나 정책이 여러 네트워크에 동시에 영향을 줄 수 있습니다.",
    designBullets: ["운영·개발·공용 서비스의 Route Table을 분리해 불필요한 Spoke 간 통신을 차단합니다.", "기본 경로를 중앙에 모을 때 Firewall 통과 여부와 장애 시 우회 경로를 명확히 합니다.", "Attachment 상태, Route, Firewall 로그를 한 흐름으로 추적할 수 있게 운영 절차를 준비합니다."]
  },
  "security-group": {
    overviewBullets: ["Security Group은 서버나 관리형 자원의 포트에 적용해 Inbound·Outbound 트래픽을 제어하는 논리적 방화벽입니다.", "SCP에서는 Virtual Server, Database, Kubernetes Engine 등에 적용하며 자원 특성에 따라 여러 Security Group을 연결할 수 있습니다.", "SCP의 새 Security Group은 Any/Deny 기본 규칙으로 모든 방향의 통신을 차단하고 사용자가 허용 규칙을 추가합니다."],
    operationDescription: "패킷의 방향, 출발지 또는 목적지 주소, 프로토콜, 포트를 규칙과 비교해 허용 여부를 판단합니다. SCP Security Group은 허용 규칙을 추가하는 방식이며 직접적인 차단 규칙은 제공하지 않습니다.",
    operationBullets: ["Inbound는 자원으로 들어오는 요청, Outbound는 자원에서 나가는 요청을 제어합니다.", "같은 Subnet의 서버끼리도 필요한 Ping, SSH, 애플리케이션 포트 규칙이 없으면 SCP에서 차단됩니다.", "여러 Security Group을 적용할 때 최종 허용 방식과 규칙 한도는 플랫폼 정책을 확인해야 합니다."],
    designDescription: "서비스 흐름을 기준으로 최소한의 주소·프로토콜·포트만 허용하고 임시 규칙이 영구적으로 남지 않게 관리합니다.",
    designBullets: ["0.0.0.0/0 허용은 공개 서비스 포트 외에는 피하고 관리 포트는 VPN 또는 관리망으로 제한합니다.", "웹 → 애플리케이션 → DB 순서의 실제 호출 방향에 맞춰 양방향 규칙을 검토합니다.", "연결 장애 시 Security Group만 보지 말고 Route, Firewall, 서버 OS 방화벽, 프로세스 리스닝 상태도 함께 확인합니다."]
  },
  firewall: {
    overviewBullets: ["Firewall은 서로 다른 네트워크 경계 사이를 지나는 트래픽에 중앙 정책을 적용하는 보안 장비 또는 서비스입니다.", "Security Group이 개별 자원 포트를 보호한다면 Firewall은 인터넷·전용회선·Load Balancer 같은 네트워크 경계 흐름을 통제합니다.", "SCP Firewall은 초기 Any/Deny 상태에서 필요한 허용 규칙을 추가하는 구조입니다."],
    operationDescription: "출발지·목적지 주소, 프로토콜, 포트, 방향으로 구성된 정책을 패킷 흐름에 적용합니다. 정책 순서와 연결 상태 추적 방식은 제품마다 다르므로 SCP 규칙 동작을 기준으로 확인합니다.",
    operationBullets: ["Internet Gateway, Direct Connect, Load Balancer 등 적용 대상별로 보호하려는 트래픽 경로가 다릅니다.", "정상 응답까지 허용하려면 요청과 응답 경로가 동일한 정책 지점을 지나는지 확인해야 합니다.", "차단 로그는 어떤 규칙에서 거부되었는지와 실제 Source NAT 이후 주소가 무엇인지 분석하는 핵심 자료입니다."],
    designDescription: "정책은 넓은 허용보다 서비스 단위의 명시적 허용을 사용하고 변경 전후 영향 범위를 검증합니다.",
    designBullets: ["업무 흐름별로 출발지·목적지·서비스 포트·책임자를 기록합니다.", "중복·미사용 규칙을 정리하고 긴급 임시 규칙에는 만료 시점을 둡니다.", "Firewall, Security Group, OS 방화벽의 책임을 나눠 동일 문제를 여러 계층에서 복잡하게 해결하지 않도록 합니다."]
  },
  "load-balancer": {
    overviewBullets: ["Load Balancer는 하나의 서비스 주소로 들어온 요청을 여러 백엔드 서버에 분산합니다.", "장애 서버를 Health Check로 제외해 가용성을 높이고 서버 증감 시 클라이언트 설정을 바꾸지 않게 합니다.", "L4는 전송 계층의 TCP·UDP 중심, L7은 HTTP·HTTPS의 Host·Path·Header 같은 애플리케이션 정보를 활용합니다."],
    operationDescription: "Listener가 클라이언트 연결을 받고, 라우팅 규칙과 분산 알고리즘에 따라 서버 그룹의 정상 멤버를 선택합니다. Health Check는 실제 사용자 요청과 별도로 백엔드 상태를 주기적으로 검사합니다.",
    operationBullets: ["Listener는 서비스 IP, 프로토콜, 포트와 연결됩니다.", "서버 그룹은 전달 프로토콜, 멤버, 가중치, 분산 방식, Health Check를 묶어 관리합니다.", "TLS 종료 위치에 따라 인증서 관리와 백엔드 구간 암호화 책임이 달라집니다."],
    designDescription: "Health Check는 단순 포트 개방보다 애플리케이션이 실제 요청을 처리할 수 있는지 확인하도록 설계합니다.",
    designBullets: ["너무 짧은 주기와 낮은 실패 임계값은 순간 지연에도 정상 서버를 제외할 수 있습니다.", "세션 고정이 필요하다면 서버 확장·장애 전환 시 세션 손실과 부하 편중을 함께 고려합니다.", "502·504 오류는 Load Balancer뿐 아니라 백엔드 연결, 타임아웃, 응답 지연, 프로토콜 불일치를 함께 확인합니다."]
  },
  vpn: {
    overviewBullets: ["Site-to-Site VPN은 인터넷 위에 IPsec 암호화 터널을 만들어 고객 네트워크와 클라우드 VPC를 연결합니다.", "전용회선보다 빠르게 구축할 수 있지만 인터넷 품질의 영향을 받고 암호화 처리량 한도가 존재할 수 있습니다.", "SCP VPN은 Passive Mode로 동작하므로 원격 Peer가 Active Mode에서 먼저 연결을 시작해야 합니다."],
    operationDescription: "IKE 협상으로 상대 장비를 인증하고 암호화 매개변수를 합의한 뒤 IPsec Security Association을 생성합니다. 이후 양쪽 사설망의 패킷이 터널에서 암호화·복호화됩니다.",
    operationBullets: ["양쪽의 로컬·원격 CIDR, 암호화 알고리즘, 인증 방식, 수명 값이 일치해야 합니다.", "Virtual Private Gateway는 VPC 측 접점이고 VPN Tunnel은 원격 Peer와의 암호화 연결입니다.", "SCP는 VPN Gateway를 이중화해 Active 장비 장애 시 Standby 장비가 동작하도록 제공합니다."],
    designDescription: "터널이 Up이어도 Route와 보안 정책이 틀리면 실제 업무 통신은 실패하므로 제어 연결과 데이터 통신을 구분해 점검합니다.",
    designBullets: ["VPC와 고객망의 CIDR 중복을 피하고 양쪽에 왕복 Route를 구성합니다.", "터널 상태, 재협상, 패킷 손실, 처리량을 모니터링하고 장애 시 원격 장비 로그도 함께 확인합니다.", "고가용성이 필요하면 다중 터널의 우선순위와 Failover 후 경로 복구 시간을 테스트합니다."]
  },
  "block-storage": {
    overviewBullets: ["Block Storage는 데이터를 고정 크기 블록으로 저장하고 서버 운영체제가 디스크 장치처럼 인식하는 스토리지입니다.", "파일시스템이나 데이터베이스는 블록 장치 위에서 자체 구조를 만들기 때문에 낮은 지연과 예측 가능한 I/O가 필요한 워크로드에 적합합니다.", "SCP에는 VM용 Block Storage와 Bare Metal 전용 Block Storage(BM)가 별도 상품으로 존재하며 이 문서는 Virtual Server용 상품을 기준으로 합니다."],
    operationDescription: "볼륨을 생성해 Virtual Server에 연결하면 OS에서 새 블록 장치로 확인할 수 있습니다. 파티션과 파일시스템을 구성해 Mount하거나 데이터베이스가 직접 사용할 수 있습니다.",
    operationBullets: ["Volume은 용량과 디스크 유형을 가진 기본 생성 단위입니다.", "Snapshot은 특정 시점 볼륨의 이미지 백업본이며 원본 복구 또는 새 볼륨 생성에 사용합니다.", "IOPS, Throughput, Latency는 서로 다른 성능 지표이므로 워크로드의 작은 랜덤 I/O와 큰 순차 I/O 특성을 구분합니다."],
    designDescription: "용량만이 아니라 필요한 IOPS·Throughput·Latency와 복구 요구사항을 기준으로 볼륨을 선택합니다.",
    designBullets: ["SCP VM용 Block Storage는 Virtual Server 연결·해제를 지원하며 공식 문서상 Multi Attach 기능도 제공합니다.", "Multi Attach 사용 시 여러 서버가 동시에 쓰면 파일시스템 손상이 발생할 수 있으므로 클러스터 인식 파일시스템이나 애플리케이션 수준의 동시성 제어가 필요합니다.", "Snapshot은 백업 전략의 일부일 뿐이므로 보존 기간과 다른 위치 복구, 실제 Restore 테스트를 함께 설계합니다."]
  },
  "file-storage": {
    overviewBullets: ["File Storage는 서버가 NFS 또는 CIFS/SMB 같은 파일 공유 프로토콜로 디렉터리와 파일을 함께 사용하는 스토리지입니다.", "여러 서버가 동일 경로를 Mount할 수 있어 공유 콘텐츠, 사용자 업로드, 공동 작업 데이터에 적합합니다.", "Block Storage와 달리 파일 이름·디렉터리·권한·잠금 같은 파일시스템 기능을 스토리지 서비스가 제공합니다."],
    operationDescription: "클라이언트 서버는 네트워크를 통해 File Storage 볼륨을 Mount하고 파일 단위로 읽기·쓰기를 요청합니다. 서버 측 파일시스템이 메타데이터와 접근 권한, 동시 접근을 처리합니다.",
    operationBullets: ["NFS는 Linux 계열, CIFS는 Windows 계열에서 주로 사용합니다.", "SCP File Storage는 사용량에 따라 용량이 자동 증감하며 성능 요구에 맞는 디스크 유형을 선택할 수 있습니다.", "Snapshot, 복제, Multi-AZ는 각각 시점 복구, 다른 위치 복사, 리전 내 가용성이라는 서로 다른 목적을 가집니다."],
    designDescription: "공유 편의성 대신 네트워크 지연과 파일 잠금, 작은 파일이 많은 워크로드의 메타데이터 부하를 고려해야 합니다.",
    designBullets: ["Mount 대상과 접근 권한을 최소화하고 NFS/CIFS 포트가 필요한 네트워크에서만 열리게 합니다.", "애플리케이션이 동시 쓰기를 수행한다면 파일 잠금과 원자적 갱신 방식이 요구사항에 맞는지 테스트합니다.", "Multi-AZ 제공 여부는 리전별로 다를 수 있으므로 실제 배포 리전의 지원 범위를 확인합니다."]
  },
  "object-storage": {
    overviewBullets: ["Object Storage는 데이터를 Object와 Metadata로 저장하고 Bucket 안에서 Key로 식별하는 스토리지입니다.", "HTTP API로 접근하며 용량을 미리 할당하지 않아도 대량의 비정형 데이터를 확장성 있게 보관할 수 있습니다.", "일반 파일시스템처럼 블록을 덮어쓰거나 디렉터리를 Mount하는 방식이 아니므로 애플리케이션 접근 패턴을 구분해야 합니다."],
    operationDescription: "클라이언트는 인증 정보를 사용해 Bucket의 Object를 생성·조회·삭제합니다. 폴더처럼 보이는 구조는 실제 디렉터리보다 Object Key의 접두사 표현에 가깝습니다.",
    operationBullets: ["Bucket은 Object를 담는 최상위 논리 단위이고 Key는 Bucket 안에서 Object를 식별합니다.", "Versioning은 같은 Key의 이전 버전을 보존해 실수로 덮어쓴 데이터를 복구하는 데 도움을 줍니다.", "SCP Object Storage API는 Amazon S3와 호환되며 인증키를 사용해 S3 도구와 연동할 수 있습니다."],
    designDescription: "정적 파일, 로그, 백업 산출물에는 적합하지만 낮은 지연의 랜덤 블록 쓰기나 POSIX 파일 잠금이 필요한 워크로드에는 맞지 않습니다.",
    designBullets: ["기본 Private 권한을 유지하고 Public URL이 꼭 필요한 Object만 공개합니다.", "Lifecycle·보존·버전 정책을 정해 오래된 데이터와 삭제 마커가 비용을 계속 발생시키지 않게 합니다.", "업로드 실패 재시도, 대용량 Multipart 처리, 무결성 검증을 애플리케이션에 반영합니다."]
  },
  backup: {
    overviewBullets: ["Backup은 원본 데이터가 삭제·손상·암호화되거나 서비스가 장애 난 뒤 복구할 수 있는 별도 사본을 만드는 체계입니다.", "Snapshot, Replica, Backup은 목적이 다릅니다. Snapshot은 빠른 시점 복구, Replica는 가용성, Backup은 독립된 보존과 장기 복구에 초점을 둡니다.", "복구 목표 시점인 RPO와 허용 가능한 복구 시간인 RTO를 먼저 정해야 주기와 보관 방식을 결정할 수 있습니다."],
    operationDescription: "Full Backup은 전체 데이터를 저장하고 Incremental Backup은 이전 백업 이후 변경분을 저장합니다. 복구할 때는 필요한 Full과 Incremental 체인을 순서대로 적용할 수 있습니다.",
    operationBullets: ["Agentless는 플랫폼이 VM Image 등을 백업하고, Agent 방식은 서버 안의 Filesystem처럼 게스트 수준 데이터를 보호합니다.", "Crash-consistent 백업과 애플리케이션-consistent 백업은 DB 트랜잭션 정합성 보장 수준이 다릅니다.", "암호화, 보관 위치, 보존 기간, 원격지 복제는 데이터 중요도와 규정에 맞게 설정합니다."],
    designDescription: "백업 성공 로그만으로 복구 가능성을 보장할 수 없으므로 정기적인 Restore 테스트가 필수입니다.",
    designBullets: ["복구할 대상, 책임자, 우선순위, 복구 후 검증 절차를 Runbook으로 만듭니다.", "운영 계정 침해나 랜섬웨어에 대비해 백업 삭제 권한과 운영 권한을 분리합니다.", "보존 기간이 지난 백업의 자동 삭제와 법적 보존 요구가 충돌하지 않는지 확인합니다."]
  },
  mysql: {
    overviewBullets: ["MySQL은 테이블·행·열과 관계를 이용해 구조화된 데이터를 저장하는 관계형 데이터베이스입니다.", "트랜잭션의 ACID 특성을 통해 여러 변경을 하나의 논리 작업으로 묶고 실패 시 일관된 상태로 되돌릴 수 있습니다.", "SCP MySQL(DBaaS)은 MySQL 엔진 설치와 HA, 백업, 모니터링 같은 운영 기능을 관리형 서비스로 제공합니다."],
    operationDescription: "SQL 요청은 Parser와 Optimizer를 거쳐 실행 계획으로 변환됩니다. Index는 필요한 행을 빠르게 찾게 하지만 쓰기 비용과 저장 공간을 추가로 사용합니다.",
    operationBullets: ["Primary Key와 Index 설계는 조회 성능뿐 아니라 조인·정렬·쓰기 비용에 영향을 줍니다.", "Transaction Isolation Level은 동시성 문제를 줄이는 대신 Lock 대기와 처리량에 영향을 줄 수 있습니다.", "Replication은 변경 로그를 다른 서버에 전달하지만 지연이 발생할 수 있어 읽기 일관성 요구를 고려해야 합니다."],
    designDescription: "스키마와 쿼리는 실제 접근 패턴을 기준으로 설계하고 실행 계획과 지표를 통해 병목을 확인합니다.",
    designBullets: ["느린 쿼리는 Index 유무만 보지 말고 실행 계획, 읽은 행 수, Lock, Buffer 사용을 함께 분석합니다.", "HA의 Failover와 Read Replica의 읽기 확장·DR 역할을 구분하고 전환 후 애플리케이션 재연결을 테스트합니다.", "Backup 보유만으로 충분하지 않으므로 목표 시점 복구와 데이터 정합성 검증 절차를 마련합니다."]
  },
  redis: {
    overviewBullets: ["Redis는 메모리를 중심으로 Key-Value와 다양한 자료 구조를 제공하는 고속 데이터 저장소입니다.", "캐시, 세션, Rate Limit, 짧은 수명의 상태처럼 빠른 응답이 중요한 데이터에 적합합니다.", "원본 데이터베이스를 대체할지 단순 캐시로 사용할지에 따라 영속성·복제·장애 처리 설계가 달라집니다."],
    operationDescription: "클라이언트는 Key로 String, Hash, List, Set, Sorted Set 같은 값을 읽고 씁니다. TTL을 지정하면 만료 시점 이후 Key가 제거되고 메모리가 부족하면 설정된 Eviction 정책이 적용됩니다.",
    operationBullets: ["Cache-Aside는 애플리케이션이 캐시를 먼저 조회하고 Miss일 때 원본 DB에서 읽어 채우는 일반적인 패턴입니다.", "RDB Snapshot과 AOF는 Redis의 대표적인 영속화 방식이며 복구 시간과 데이터 손실 범위가 다릅니다.", "Replica는 읽기 확장과 복구에 사용되지만 비동기 복제 지연 가능성을 고려해야 합니다."],
    designDescription: "캐시는 없어져도 원본에서 복구할 수 있게 설계하고, Hot Key와 Cache Stampede가 원본 DB 장애로 번지지 않게 보호합니다.",
    designBullets: ["모든 임시 Key에 적절한 TTL을 두고 메모리 사용량과 Eviction 횟수를 관찰합니다.", "큰 Value와 전체 Key 검색 명령은 단일 스레드 처리 지연을 키울 수 있으므로 데이터 구조와 명령 복잡도를 검토합니다.", "SCP CacheStore의 Sentinel Failover 후 연결 정보 갱신과 애플리케이션 재시도 동작을 테스트합니다."]
  },
  clickhouse: {
    overviewBullets: ["ClickHouse는 대규모 데이터를 열 단위로 저장하고 집계·분석하는 OLAP 데이터베이스입니다.", "조회에 필요한 Column만 읽고 압축 효율을 높일 수 있어 로그, 이벤트, 시계열 분석에 적합합니다.", "행 단위 빈번한 갱신과 짧은 트랜잭션이 중심인 OLTP 데이터베이스와 목적이 다릅니다."],
    operationDescription: "MergeTree 계열 테이블은 데이터를 Part 단위로 쓰고 백그라운드 Merge로 정리합니다. Partition Key는 데이터 관리 범위를, Ordering Key는 읽을 데이터 범위를 줄이는 데 중요한 역할을 합니다.",
    operationBullets: ["Batch Insert는 작은 Insert를 반복하는 것보다 Part 수와 처리 효율 측면에서 유리합니다.", "Columnar Storage와 Vectorized Execution은 많은 행의 일부 Column을 집계할 때 강점을 보입니다.", "Replication은 동일 Shard의 복제, Sharding은 데이터 분산을 담당하므로 역할을 구분합니다."],
    designDescription: "질의의 Filter·Group By 패턴을 기준으로 Partition과 Ordering Key를 선택하고 무제한 고카디널리티 조회를 경계합니다.",
    designBullets: ["너무 많은 작은 Part는 Merge 부하를 키우므로 수집 단계에서 적절히 묶어 Insert합니다.", "데이터 보존 기간은 TTL과 Partition 삭제 전략으로 관리합니다.", "Kafka Connect나 수집 파이프라인에서 중복·재처리 가능성을 고려해 이벤트 식별자와 적재 정책을 설계합니다."]
  },
  kubernetes: {
    overviewBullets: ["Kubernetes는 컨테이너 애플리케이션의 배포 상태를 선언하면 실제 상태가 목표 상태와 같아지도록 지속적으로 조정하는 오케스트레이션 시스템입니다.", "서버 한 대가 아니라 Cluster 전체를 대상으로 Scheduling, Scaling, Self-healing, Service Discovery를 제공합니다.", "SCP Kubernetes Engine은 Control Plane 운영 부담을 줄이고 Worker Node와 클러스터 기능을 제공하는 관리형 상품입니다."],
    operationDescription: "API Server에 제출한 YAML은 etcd에 목표 상태로 저장됩니다. Controller가 차이를 감지하고 Scheduler가 Pod를 Node에 배치하며 Kubelet이 Container Runtime을 통해 실행합니다.",
    operationBullets: ["Pod는 가장 작은 실행 단위이고 Deployment는 Replica 수와 Rolling Update를 관리합니다.", "Service는 변하는 Pod IP 앞에 안정적인 접근점을 제공하며 ClusterIP, NodePort, LoadBalancer 유형이 있습니다.", "ConfigMap과 Secret은 설정을 분리하고 Persistent Volume은 Pod 수명과 독립된 데이터를 제공합니다."],
    designDescription: "컨테이너가 실행 중이라는 사실과 서비스가 정상이라는 사실을 구분해 Probe, Resource, 배포 전략을 설정합니다.",
    designBullets: ["Requests와 Limits를 실제 사용량에 맞춰 설정해 Scheduling 실패와 OOMKill을 줄입니다.", "Readiness Probe는 트래픽 수신 가능 여부, Liveness Probe는 재시작 필요 여부를 판단하도록 분리합니다.", "Service type LoadBalancer를 사용할 때 외부 LB, Security Group, Health Check, Source IP 보존 요구를 함께 확인합니다."]
  },
  terraform: {
    overviewBullets: ["Terraform은 HCL 파일에 원하는 인프라 상태를 선언하고 Provider API를 통해 실제 자원을 생성·변경·삭제하는 IaC 도구입니다.", "수동 Console 작업을 코드와 검토 가능한 변경 계획으로 바꿔 환경 재현성과 변경 이력을 높입니다.", "Terraform Registry의 Samsung Cloud Platform Provider는 Terraform 구성과 SCP API 사이의 변환 계층입니다."],
    operationDescription: "Terraform은 Configuration, 현재 State, Provider가 조회한 실제 상태를 비교해 실행 계획을 만듭니다. Apply 시 의존성 그래프 순서에 따라 API를 호출하고 결과를 State에 기록합니다.",
    operationBullets: ["Resource는 관리할 자원, Data Source는 기존 자원 조회, Variable과 Output은 입력·출력을 담당합니다.", "State에는 자원 ID와 속성이 포함되므로 협업 환경에서는 잠금과 접근 제어가 가능한 원격 저장소가 필요합니다.", "Plan은 예상 변경을 보여주지만 실제 API 제약과 Apply 중 외부 변경까지 완전히 보장하지는 않습니다."],
    designDescription: "Module은 반복 가능한 경계를 만들되 지나치게 많은 추상화보다 책임과 변경 주기가 같은 자원을 묶습니다.",
    designBullets: ["Provider 버전과 Module 버전을 고정하고 업그레이드 시 Plan을 검토합니다.", "비밀 값은 코드와 State 노출 가능성을 고려해 별도 Secret 관리 체계로 전달합니다.", "Console에서 수동 변경한 Drift를 정기적으로 탐지하고 Import·코드 수정·원복 중 의도에 맞는 방식을 선택합니다."]
  },
  ansible: {
    overviewBullets: ["Ansible은 YAML Playbook으로 서버 설정, 패키지 설치, 파일 배포, 서비스 제어를 자동화하는 구성 관리 도구입니다.", "대상 서버에 상주 Agent를 두지 않고 일반적으로 SSH 또는 WinRM을 통해 작업합니다.", "서버 생성 자체보다 생성된 서버 내부의 일관된 상태를 만드는 데 강점이 있습니다."],
    operationDescription: "Inventory에서 대상 Host와 Group을 선택하고 Playbook의 Task를 순서대로 실행합니다. Module은 현재 상태를 확인한 뒤 필요한 변경만 수행하도록 설계됩니다.",
    operationBullets: ["Play는 대상 Host, Variable, Role, Task를 연결합니다.", "Handler는 설정 파일이 바뀐 경우처럼 Notify가 발생했을 때 서비스 재시작을 수행합니다.", "Role은 Task, Template, File, Default Variable을 재사용 가능한 구조로 묶습니다."],
    designDescription: "같은 Playbook을 반복 실행해도 결과가 안정적으로 같아지는 멱등성을 우선합니다.",
    designBullets: ["shell 명령을 무조건 실행하기보다 상태를 이해하는 전용 Module을 사용합니다.", "환경별 Inventory와 Variable을 분리하고 Vault 등으로 비밀 값을 보호합니다.", "한 번에 모든 서버를 변경하지 않도록 Batch 크기와 실패 중단 조건, Rollback 절차를 설정합니다."]
  },
  docker: {
    overviewBullets: ["Docker는 애플리케이션과 실행 의존성을 Image로 패키징하고 격리된 Container Process로 실행하는 플랫폼입니다.", "Container는 별도 VM이 아니라 Host Kernel을 공유하므로 시작이 빠르고 배포 단위를 표준화할 수 있습니다.", "Image는 불변 배포 산출물, Container는 해당 Image에서 생성된 실행 인스턴스입니다."],
    operationDescription: "Dockerfile의 각 명령은 Image Layer를 만들 수 있으며 Build 결과는 Registry에 저장됩니다. 실행 시 읽기 전용 Image Layer 위에 Container 쓰기 Layer와 Network·Volume 설정이 결합됩니다.",
    operationBullets: ["Namespace는 Process·Network 등을 격리하고 cgroup은 CPU·Memory 같은 자원 사용량을 제한합니다.", "Volume은 Container 삭제와 독립적으로 데이터를 보존하고 Bind Mount는 Host 경로를 직접 연결합니다.", "Port Publish는 Host 포트를 Container 포트로 전달하지만 애플리케이션의 실제 리스닝 주소도 맞아야 합니다."],
    designDescription: "Image는 작고 재현 가능하게 만들고 실행 중 생성되는 데이터와 비밀 정보는 Image 밖에서 주입합니다.",
    designBullets: ["Multi-stage Build와 최소 Base Image로 불필요한 도구와 취약점 범위를 줄입니다.", "root 실행을 피하고 읽기 전용 파일시스템·Capability 최소화 같은 런타임 제한을 적용합니다.", "latest 대신 추적 가능한 Tag 또는 Digest를 사용하고 Image 취약점과 SBOM을 관리합니다."]
  },
  nginx: {
    overviewBullets: ["Nginx는 정적 파일을 제공하는 Web Server이자 요청을 Backend로 전달하는 Reverse Proxy입니다.", "Client Connection을 받아 TLS 종료, Host·Path 기반 Routing, Header 처리, 캐싱, 압축 등을 수행할 수 있습니다.", "Load Balancer 앞 또는 애플리케이션 서버 앞에서 외부 요청과 내부 서비스의 경계를 만듭니다."],
    operationDescription: "Master Process가 설정과 Worker를 관리하고 Worker Process가 Event-driven 방식으로 다수 Connection을 처리합니다. 요청은 server와 location 규칙에 따라 정적 파일 또는 Upstream으로 전달됩니다.",
    operationBullets: ["server_name과 listen은 Virtual Host의 진입 조건을 정의합니다.", "location은 URI 매칭과 처리 규칙을, upstream은 Backend Server 집합을 정의합니다.", "proxy_set_header, timeout, buffer 설정은 Backend가 보는 요청 정보와 장애 동작에 영향을 줍니다."],
    designDescription: "Proxy 계층은 원래 Client IP, Protocol, Request ID가 Backend와 Log에 올바르게 전달되도록 구성합니다.",
    designBullets: ["X-Forwarded-For와 X-Forwarded-Proto는 신뢰 가능한 Proxy 체인에서만 사용합니다.", "Timeout을 무작정 늘리기보다 Backend 지연 원인을 찾고 Client·LB·Nginx·Application 값을 일관되게 맞춥니다.", "설정 반영 전 문법 검사를 수행하고 Reload가 기존 Connection에 미치는 영향을 확인합니다."]
  },
  jenkins: {
    overviewBullets: ["Jenkins는 Source Code 변경을 Trigger로 Build, Test, Package, Deploy 작업을 자동화하는 CI/CD Server입니다.", "Pipeline을 코드로 관리하면 실행 단계와 승인·실패 조건을 Repository에서 함께 검토할 수 있습니다.", "Controller는 작업을 조정하고 Agent는 실제 Build를 실행하도록 역할을 분리할 수 있습니다."],
    operationDescription: "Webhook, Schedule, 수동 실행 등이 Job을 시작하면 Pipeline Stage가 순서 또는 병렬로 실행됩니다. 각 Step의 결과와 Artifact, Log가 다음 배포 판단의 근거가 됩니다.",
    operationBullets: ["Declarative Pipeline은 stages, steps, post 같은 구조화된 문법을 제공합니다.", "Agent Label로 필요한 OS·도구를 가진 실행 환경을 선택합니다.", "Credential Store는 Pipeline에 비밀 값을 주입하지만 Log 출력과 Script 노출을 별도로 방지해야 합니다."],
    designDescription: "같은 Commit은 같은 결과를 만들어야 하며 Build Artifact는 한 번 생성한 뒤 환경별로 승격하는 흐름이 안정적입니다.",
    designBullets: ["Unit·Integration·Security Test를 배포 전 Gate로 구성합니다.", "운영 배포에는 승인, 점진 배포, Health Check, 자동 또는 수동 Rollback 절차를 둡니다.", "Plugin은 공급망과 권한 위험을 늘릴 수 있으므로 필요한 것만 설치하고 업데이트·호환성을 관리합니다."]
  },
  linux: {
    overviewBullets: ["Linux는 Process, Memory, File, Network, Device를 관리하고 애플리케이션에 System Call 인터페이스를 제공하는 운영체제입니다.", "서버 장애 분석에서는 애플리케이션 Log뿐 아니라 Kernel, Resource, Filesystem, Network 상태를 함께 봐야 합니다.", "배포판마다 Package Manager와 기본 설정은 달라도 Process·Permission·Filesystem 같은 핵심 개념은 공통입니다."],
    operationDescription: "Kernel이 CPU Scheduling, Virtual Memory, I/O, Network Stack을 관리하고 User Space Process가 System Call을 통해 자원을 사용합니다. systemd 기반 환경에서는 Unit이 Service 시작·종료와 의존성을 관리합니다.",
    operationBullets: ["Process 상태, PID, Exit Code, Signal은 실행과 종료 원인을 설명합니다.", "사용자·그룹·파일 Permission과 sudo 정책은 접근 권한의 기본 경계입니다.", "Filesystem 사용량과 Inode, Page Cache, Swap은 디스크와 메모리 문제를 구분하는 데 필요합니다."],
    designDescription: "장애 대응은 증상을 재현하고 시간대를 맞춘 뒤 자원·로그·네트워크를 좁혀 가는 방식으로 수행합니다.",
    designBullets: ["CPU는 사용률뿐 아니라 Load Average, Run Queue, I/O Wait를 함께 확인합니다.", "Memory 부족은 RSS, Cache, Swap, OOM 기록을 함께 보고 단순 Free 수치만으로 판단하지 않습니다.", "포트 장애는 DNS, Route, Socket Listen, Local Firewall, 원격 정책, Packet Capture 순으로 범위를 나눕니다."]
  },
  kafka: {
    overviewBullets: ["Kafka는 Producer가 기록한 Event를 Topic에 보존하고 여러 Consumer가 독립적으로 읽는 분산 Event Streaming Platform입니다.", "Message를 즉시 전달하고 버리는 Queue와 달리 설정된 보존 기간 동안 Log에 남겨 재처리할 수 있습니다.", "대량 로그 수집, 서비스 간 비동기 처리, 데이터 파이프라인의 완충 계층에 적합합니다."],
    operationDescription: "Topic은 여러 Partition으로 나뉘고 각 Partition은 순서가 있는 Append-only Log입니다. Producer는 Partition을 선택해 기록하고 Consumer Group은 Partition을 Member에 분배합니다.",
    operationBullets: ["순서는 Topic 전체가 아니라 같은 Partition 안에서 보장됩니다.", "Offset은 Consumer가 어디까지 읽었는지 나타내며 Commit 시점이 중복 처리와 유실 가능성에 영향을 줍니다.", "Replication Factor와 In-Sync Replica는 Broker 장애 시 데이터 가용성과 쓰기 안정성에 관여합니다."],
    designDescription: "처리량을 위해 Partition을 늘리면 병렬성은 높아지지만 순서 범위와 Rebalance 비용, 운영 복잡도도 커집니다.",
    designBullets: ["Key를 사용해 같은 업무 식별자의 Event가 같은 Partition에 가도록 설계합니다.", "At-least-once 환경에서는 중복 처리에 안전한 Idempotent Consumer를 구현합니다.", "Consumer Lag, Under-replicated Partition, Disk 사용량, Produce·Fetch 지연을 핵심 지표로 관찰합니다."]
  },
  "kafka-connect": {
    overviewBullets: ["Kafka Connect는 Kafka와 외부 시스템 사이의 데이터 수집·적재 작업을 Connector 설정으로 표준화하는 Framework입니다.", "Source Connector는 외부 데이터를 Kafka로 가져오고 Sink Connector는 Kafka Event를 DB·Search·Object Storage 등으로 내보냅니다.", "애플리케이션마다 반복적인 Polling·Batch·Offset 코드를 직접 구현하는 부담을 줄입니다."],
    operationDescription: "Connector가 작업을 Task로 나누고 Worker가 실행합니다. Distributed Mode에서는 여러 Worker가 Connector와 Task를 분산하며 설정·Offset·상태를 내부 Topic에 저장합니다.",
    operationBullets: ["Converter는 Kafka Record와 JSON·Avro·String 같은 외부 표현 사이를 변환합니다.", "Single Message Transform은 간단한 필드 변경과 필터링을 수행하지만 복잡한 업무 변환에는 적합하지 않습니다.", "Error Tolerance와 Dead Letter Queue는 변환 또는 적재 실패가 전체 Pipeline을 중단할지 결정합니다."],
    designDescription: "Connector가 보장하는 전달 의미와 대상 시스템의 Upsert·Transaction 지원을 함께 이해해야 중복과 유실을 제어할 수 있습니다.",
    designBullets: ["Schema 변경 시 Producer, Converter, Sink Table의 호환성을 검증합니다.", "재시도 불가능한 Record는 DLQ로 격리하고 원인 수정 후 재처리할 절차를 둡니다.", "Task 수를 무작정 늘리기보다 Source Partition과 Sink 처리량, 외부 API 한도를 기준으로 조정합니다."]
  },
  fastapi: {
    overviewBullets: ["FastAPI는 Python Type Hint와 ASGI를 기반으로 API를 작성하는 Web Framework입니다.", "Pydantic Model을 사용해 Request·Response Data를 검증하고 OpenAPI 문서를 자동 생성합니다.", "비동기 I/O가 많은 API와 Data·AI Service의 얇은 HTTP 계층에 자주 사용됩니다."],
    operationDescription: "ASGI Server가 요청을 받아 Path Operation Function을 호출합니다. Dependency Injection이 인증·DB Session 같은 공통 의존성을 제공하고 Pydantic이 입출력 Schema를 검증합니다.",
    operationBullets: ["async def는 Network·DB처럼 기다림이 많은 비동기 Library와 사용할 때 효과가 있습니다.", "CPU 집약 작업은 Event Loop를 막을 수 있으므로 Worker Process나 별도 Job Queue로 분리합니다.", "Response Model은 외부로 노출할 Field를 제한하고 API Contract를 명확히 합니다."],
    designDescription: "Validation Error, 업무 Error, 외부 시스템 Error를 구분해 일관된 Status Code와 Error Body를 제공합니다.",
    designBullets: ["DB Transaction 범위와 Session 수명을 요청 단위로 명확히 관리합니다.", "긴 작업은 요청을 오래 붙잡지 않고 비동기 Job ID와 상태 조회 방식으로 분리합니다.", "Authentication, CORS, Rate Limit, Request Size 제한은 배포 환경의 Proxy 설정과 함께 검토합니다."]
  },
  prometheus: {
    overviewBullets: ["Prometheus는 수치형 상태를 Label이 붙은 Time Series로 저장하고 PromQL로 조회하는 Monitoring System입니다.", "일반적으로 Exporter나 애플리케이션의 HTTP Endpoint를 주기적으로 Scrape하는 Pull 방식을 사용합니다.", "현재 값뿐 아니라 시간에 따른 Rate·증감·분포를 계산해 이상 징후와 용량 추세를 파악합니다."],
    operationDescription: "Prometheus Server가 Service Discovery로 Target을 찾고 Scrape Interval마다 Metric을 수집합니다. Recording Rule은 자주 쓰는 계산 결과를 저장하고 Alerting Rule은 조건을 만족한 Series를 Alertmanager로 보냅니다.",
    operationBullets: ["Metric 이름과 Label 집합이 하나의 Time Series를 식별합니다.", "Counter는 누적값, Gauge는 증감 가능한 현재값, Histogram은 관측값을 Bucket별로 집계합니다.", "rate()는 Counter의 단위 시간당 증가율을 계산할 때 사용하며 단순 차이보다 Reset을 고려합니다."],
    designDescription: "Label 값이 무한히 늘어나는 High Cardinality는 Memory와 저장 비용을 급격히 키우므로 식별자 선택이 중요합니다.",
    designBullets: ["User ID, Request ID처럼 값 종류가 매우 많은 정보는 Label로 사용하지 않습니다.", "Alert는 원인보다 사용자 영향과 조치 가능성을 중심으로 임계값과 지속 시간을 설정합니다.", "수집 실패 자체를 알 수 있도록 Target Up, Rule Error, Storage 상태도 별도로 감시합니다."]
  },
  grafana: {
    overviewBullets: ["Grafana는 Prometheus, Loki, 데이터베이스 등 여러 Data Source를 조회해 Dashboard와 Alert를 구성하는 Observability UI입니다.", "데이터를 직접 생성하는 시스템이 아니라 각 Source에 Query를 보내 결과를 시각화합니다.", "운영자는 Metric과 Log를 같은 시간 범위에서 비교해 증상과 원인을 연결할 수 있습니다."],
    operationDescription: "Panel마다 Data Source와 Query, Transformation, Visualization을 정의합니다. Variable은 환경·서비스·Instance 선택을 동적으로 바꾸고 Alert Rule은 Query 결과를 조건과 비교합니다.",
    operationBullets: ["Dashboard는 Overview → Service → Instance처럼 탐색 경로가 이어지게 구성합니다.", "Transformation은 여러 Query 결과를 결합하거나 표시 형태를 바꾸지만 원본 의미를 왜곡하지 않게 사용합니다.", "Alert Contact Point와 Notification Policy는 심각도·팀·시간대에 따라 알림 전달 경로를 결정합니다."],
    designDescription: "보기 좋은 Graph보다 사용자가 판단하고 행동할 수 있는 지표·단위·기준선을 제공하는 것이 중요합니다.",
    designBullets: ["Traffic, Error, Latency, Saturation을 서비스의 핵심 흐름에 맞춰 배치합니다.", "평균값만 사용하지 말고 P95·P99 지연과 Error 비율을 함께 보여줍니다.", "Dashboard JSON과 Provisioning 설정을 Version Control로 관리해 환경 간 재현성을 높입니다."]
  },
  loki: {
    overviewBullets: ["Loki는 Log 본문 전체를 색인하기보다 Label을 중심으로 Stream을 구성하는 Log Aggregation System입니다.", "Grafana와 연동해 Metric Dashboard에서 같은 시간대의 Log로 이동하기 쉽습니다.", "저장 비용을 줄일 수 있지만 Label과 LogQL Query를 잘못 설계하면 조회 성능이 크게 떨어질 수 있습니다."],
    operationDescription: "수집 Agent가 Log Entry에 Label을 붙여 Loki에 전송하면 Distributor와 Ingester가 Stream 단위 Chunk로 처리하고 Index와 Object Data를 저장합니다. Query Frontend와 Querier가 LogQL 요청을 분산 조회합니다.",
    operationBullets: ["Label 집합이 같은 Log는 하나의 Stream으로 묶입니다.", "LogQL은 Label Selector로 Stream 범위를 먼저 줄이고 Pipeline Stage로 본문을 Filter·Parse합니다.", "Retention과 Compaction은 오래된 Log의 보존 비용과 삭제 시점을 관리합니다."],
    designDescription: "Service, Environment, Namespace처럼 값 종류가 제한된 항목만 Label로 사용하고 Request ID 같은 값은 Log 본문에 둡니다.",
    designBullets: ["High-cardinality Label은 Stream 수를 폭증시키므로 피합니다.", "JSON 등 구조화 Log를 사용해 필요한 Field를 Query 시점에 Parse할 수 있게 합니다.", "개인정보·Token·Password는 수집 전 단계에서 Masking하고 접근 권한과 보존 기간을 제한합니다."]
  },
  promtail: {
    overviewBullets: ["Promtail은 파일과 System Journal 등의 Log를 읽고 Label을 붙여 Loki로 전송하던 수집 Agent입니다.", "Position File로 마지막 읽은 위치를 기록해 재시작 후 이어서 수집합니다.", "Promtail은 2026년 3월 EOL이므로 기존 환경 이해와 Migration 목적으로만 다루고 신규 구성은 Grafana Alloy를 우선 검토합니다."],
    operationDescription: "Target Discovery가 수집할 Log를 찾고 Pipeline Stage가 Multiline·Regex·JSON Parsing, Label 추가, 내용 변경을 수행한 뒤 Loki Client가 Batch로 전송합니다.",
    operationBullets: ["scrape_configs는 Target과 Log Path를 정의합니다.", "Pipeline Stage 순서에 따라 Parsing 결과가 달라지므로 Sample Log로 검증해야 합니다.", "Position File을 잃거나 공유 Storage에서 잘못 사용하면 Log 중복 또는 누락 가능성이 있습니다."],
    designDescription: "기존 Promtail 설정을 Alloy로 옮길 때 수집 경로, Parsing, Label, Tenant, Buffer 동작을 항목별로 비교합니다.",
    designBullets: ["Multiline Stack Trace가 개별 Line으로 쪼개지지 않게 시작 Pattern을 정확히 설정합니다.", "민감 정보는 Loki 전송 전에 Drop 또는 Replace Stage로 제거합니다.", "Loki 장애 시 Agent의 재시도·Buffer와 Disk 사용량이 서비스 Host에 미치는 영향을 관찰합니다."]
  },
  "mcp-server": {
    overviewBullets: ["MCP Server는 AI Application이 외부 Data와 기능을 표준화된 방식으로 발견하고 호출하도록 Resource, Prompt, Tool을 제공하는 Server입니다.", "LLM이 Database에 직접 접속하는 구조가 아니라 허용된 기능을 Server가 명시하고 입력 검증·권한·감사를 통제하는 경계가 됩니다.", "이 Portfolio에서는 Messenger의 하루 대화를 조회·요약하기 위해 MCP Server와 ClickHouse를 연결한 구성을 설명합니다."],
    operationDescription: "Client와 Server가 연결을 초기화하고 지원 Capability를 교환한 뒤 Client가 Tool 목록을 조회합니다. Model이 Tool 사용을 결정하면 Client가 구조화된 Argument로 Server를 호출하고 결과를 다시 Model Context에 전달합니다.",
    operationBullets: ["Tool은 실행 가능한 기능과 Input Schema를 정의합니다.", "Resource는 Model에 제공할 Data를 URI 기반으로 노출하고 Prompt는 재사용 가능한 대화 Template을 제공할 수 있습니다.", "Transport와 Session 방식은 SDK와 배포 구조에 따라 달라지며 인증은 MCP 바깥의 서비스 보안과 함께 설계합니다."],
    designDescription: "Model의 자연어 판단을 신뢰 경계로 사용하지 않고 Server가 허용 범위와 Query 비용을 강제해야 합니다.",
    designBullets: ["ClickHouse Query는 날짜·대화방·조회 행 수를 제한하고 임의 SQL 실행을 Tool로 직접 노출하지 않습니다.", "개인 대화에 대한 사용자 권한과 최소 데이터 반환, Masking, 호출 감사 Log를 적용합니다.", "Tool Timeout·재시도·부분 실패를 정의하고 요약 결과가 원문과 다른 경우 확인할 수 있는 근거 ID를 남깁니다."]
  },
  java: {
    overviewBullets: ["Java는 JVM에서 실행되는 정적 Type 언어로 Garbage Collection, 풍부한 표준 Library, 성숙한 Server 생태계를 제공합니다.", "Source는 Bytecode로 Compile되고 JVM이 해석·JIT Compile하여 다양한 운영체제에서 실행합니다.", "Spring Boot와 함께 Web API, Batch, Messaging 기반 Backend를 구성하는 데 널리 사용됩니다."],
    operationDescription: "Class Loader가 Class를 읽고 JVM Runtime Data Area에 배치합니다. Heap에는 Object가 저장되고 Thread별 Stack에는 Method Frame과 Local Variable이 저장되며 Garbage Collector가 도달 불가능한 Object를 회수합니다.",
    operationBullets: ["Interface와 Composition은 구현 세부사항을 분리하고 Test 가능한 경계를 만드는 데 사용합니다.", "Checked·Unchecked Exception의 의미를 구분하고 업무 실패를 무조건 일반 Exception으로 숨기지 않습니다.", "Thread Pool과 Blocking I/O는 처리량·대기시간·Memory 사용에 영향을 주므로 동시성 한도를 관리합니다."],
    designDescription: "Package와 Layer는 기술 이름보다 Domain 책임과 변경 이유가 함께 모이도록 구성합니다.",
    designBullets: ["Controller는 입출력 변환, Application Service는 Use Case, Domain은 업무 규칙, Repository는 저장소 접근 책임으로 구분합니다.", "불변 객체와 명확한 Validation으로 잘못된 상태가 Domain 안에 들어오지 않게 합니다.", "JVM Heap, GC Pause, Thread, Connection Pool, Error Rate를 함께 관찰해 애플리케이션 병목을 분석합니다."]
  },
  junit: {
    overviewBullets: ["JUnit은 Java Code의 기대 동작을 자동으로 검증하는 Test Framework입니다.", "작은 단위의 Logic부터 여러 Component가 연결된 Integration Test까지 Test Lifecycle과 Assertion을 제공합니다.", "Test는 구현을 그대로 따라 쓰는 것이 아니라 외부에서 관찰 가능한 계약과 중요한 실패 조건을 고정합니다."],
    operationDescription: "Test Engine이 Annotation과 Test Method를 발견하고 Lifecycle Callback을 실행합니다. Assertion이 기대값과 실제값을 비교하며 실패 위치와 원인을 Report합니다.",
    operationBullets: ["@Test는 Test Case, @BeforeEach·@AfterEach는 Case별 준비와 정리를 정의합니다.", "Parameterized Test는 여러 입력·경계값을 같은 계약으로 검증합니다.", "Mock은 외부 의존성을 통제하지만 내부 구현 호출을 과도하게 검증하면 Refactoring에 취약해집니다."],
    designDescription: "Arrange-Act-Assert 흐름으로 읽기 쉽게 작성하고 한 Test가 실패한 이유를 하나의 행동으로 좁힙니다.",
    designBullets: ["정상값, 경계값, 잘못된 입력, 의존성 실패를 분리해 검증합니다.", "시간·Random·Network·Database에 의존하는 요소를 통제해 반복 실행 가능한 Test를 만듭니다.", "Coverage 숫자보다 중요한 업무 규칙과 회귀 위험을 실제로 검증하는지 우선합니다."]
  },
};

const article = (id: string, category: KnowledgeBaseArticle["category"], title: string, description: string, keywords: string[], usage: string, practices: string[], parentId?: string): KnowledgeBaseArticle => {
  const detail = articleDetails[id];
  const prerequisite = scpPrerequisites[id];

  return {
    id, category, title, description, keywords, parentId,
    sections: [
      { title: "개요", description, bullets: detail?.overviewBullets ?? ["이 기술이 해결하는 문제와 적용 범위를 확인합니다."] },
      { title: "핵심 구성 요소", description: usage, bullets: practices },
      ...(detail ? [
        { title: "동작 방식", description: detail.operationDescription, bullets: detail.operationBullets },
        { title: "활용과 설계 포인트", description: detail.designDescription, bullets: detail.designBullets },
      ] : []),
      ...(prerequisite ? [{ title: "SCP 공식 선행 서비스", description: prerequisite.description, bullets: prerequisite.bullets }] : []),
    ],
  };
};

export const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
  article("vpc", "Networking", "VPC", "클라우드 안에 독립된 가상 네트워크 공간을 구성하는 기반 서비스입니다.", ["VPC", "Subnet", "Internet Gateway", "NAT Gateway", "VPC Peering", "VPC Endpoint", "Transit Gateway"], "IP 대역과 Subnet, 라우팅을 분리해 서비스의 네트워크 경계를 정의합니다.", ["Public·Private Subnet을 분리해 외부 노출과 내부 처리를 구분합니다.", "Internet Gateway와 NAT Gateway의 진입·송신 경로를 명확히 합니다.", "Peering·Endpoint·Transit Gateway는 연결 대상과 확장성을 기준으로 선택합니다."]),
  article("subnet", "Networking", "Subnet", "VPC의 IP 주소 범위를 기능과 보안 경계에 따라 더 작은 네트워크로 나누는 단위입니다.", ["Subnet", "CIDR", "Public Subnet", "Private Subnet"], "웹 서버, 애플리케이션 서버, 데이터베이스처럼 서로 다른 역할의 자원을 별도 Subnet에 배치하고, 각 Subnet에 필요한 라우팅과 접근 정책을 연결합니다.", ["서비스 역할별로 CIDR 대역을 미리 계획해 주소 충돌과 확장 문제를 줄입니다.", "Public Subnet은 외부 진입이 필요한 자원에만 사용하고, DB 같은 내부 자원은 Private Subnet에 둡니다.", "Subnet만으로 접근이 허용되는 것은 아니므로 라우팅·Security Group·Firewall을 함께 확인합니다."], "vpc"),
  article("internet-gateway", "Networking", "Internet Gateway", "VPC의 자원이 인터넷과 통신할 수 있게 연결하는 네트워크 출입구입니다.", ["Internet Gateway", "IG", "Public IP", "Route Table"], "외부 사용자가 접근하는 웹 서비스나 공인 IP가 필요한 자원의 인터넷 경로를 구성할 때 사용합니다. 연결 이후에도 어느 Subnet에서 어떤 트래픽을 허용할지는 라우팅과 보안 정책으로 별도 제어합니다.", ["Internet Gateway를 연결했다고 모든 서버가 공개되는 것은 아니며 공인 IP, 라우팅, 보안 규칙이 함께 충족되어야 합니다.", "공개가 필요한 Load Balancer와 웹 계층만 외부 경로에 두고, DB와 내부 서비스는 Private Subnet에 유지합니다.", "인바운드 정책은 필요한 포트와 출발지만 허용하는 최소 권한 원칙으로 작성합니다."], "vpc"),
  article("nat-gateway", "Networking", "NAT Gateway", "Private Subnet의 서버가 외부 인터넷으로 나갈 수 있게 하되, 외부에서 먼저 들어오는 연결은 받지 않도록 하는 송신 전용 게이트웨이입니다.", ["NAT Gateway", "NAT", "Outbound", "Private Subnet"], "패키지 업데이트, 외부 API 호출처럼 내부 서버의 아웃바운드 인터넷 통신이 필요하지만 서버 자체에는 공인 IP를 부여하지 않으려는 경우에 사용합니다.", ["NAT Gateway는 Private Subnet 자원의 공인 노출을 대체하지 않으며, 외부에서 시작하는 인바운드 연결은 허용하지 않습니다.", "SCP에서는 General 타입 Subnet에 생성하고 Internet Gateway 경로와 함께 구성하는지 확인합니다.", "NAT Gateway의 대표 공인 IP와 라우팅 대상을 점검해 의도치 않은 외부 통신을 줄입니다."], "vpc"),
  article("vpc-peering", "Networking", "VPC Peering", "서로 분리된 두 VPC가 사설 IP로 통신할 수 있도록 직접 연결하는 방식입니다.", ["VPC Peering", "Private Connectivity", "CIDR", "Route Table"], "서비스 또는 환경별로 분리된 VPC 사이에 데이터베이스, 내부 API, 공통 서비스 연결이 필요한 경우 사설 네트워크 경로를 구성합니다.", ["연결할 VPC의 CIDR 대역이 겹치지 않는지 먼저 확인합니다.", "양쪽 VPC의 라우팅과 보안 정책을 모두 설정해야 실제 통신이 가능합니다.", "연결 관계가 많아질수록 관리가 복잡해지므로 허브형 연결이 필요한지 Transit Gateway 같은 대안을 함께 검토합니다."], "vpc"),
  article("vpc-endpoint", "Networking", "VPC Endpoint", "인터넷을 거치지 않고 사설 네트워크 경로로 특정 서비스에 연결하는 접점입니다.", ["VPC Endpoint", "Private Access", "Endpoint Subnet", "SCP"], "외부 인터넷 경로를 열지 않고 클라우드 서비스 또는 연결된 네트워크의 기능에 접근해야 할 때 사용하며, 서비스 접근 경로를 VPC 내부에 유지합니다.", ["일반 Endpoint 개념과 SCP의 VPC Endpoint Subnet을 구분해, 실제 연결 대상과 지원 범위를 가이드에서 확인합니다.", "Endpoint를 사용해도 접근 권한과 DNS·라우팅 설정은 별도로 검증합니다.", "민감한 데이터가 오가는 서비스는 인터넷 경유 여부와 감사 로그 요구사항을 함께 점검합니다."], "vpc"),
  article("transit-gateway", "Networking", "Transit Gateway", "여러 VPC와 온프레미스 네트워크 연결을 중앙에서 중계하는 허브형 라우팅 구성입니다.", ["Transit Gateway", "Hub-and-Spoke", "Routing", "Hybrid Cloud"], "VPC 수가 늘어 Peering을 개별로 연결하기 어려울 때, 중앙 허브를 통해 연결 관계와 라우팅 정책을 일관되게 관리하는 데 사용합니다.", ["연결 대상을 Spoke로 분리하고 중앙 허브에서 필요한 경로만 허용합니다.", "모든 연결이 자동으로 서로 통신하는 것은 아니므로 라우팅 테이블과 격리 정책을 명확히 설계합니다.", "사용 중인 클라우드의 제공 여부와 세부 기능은 일반 개념과 별도로 해당 플랫폼 문서를 확인합니다."], "vpc"),
  article("security-group", "Networking", "Security Group", "서버 단위의 인바운드·아웃바운드 트래픽을 제어하는 가상 방화벽입니다.", ["Security Group", "Port", "Protocol", "Inbound", "Outbound"], "포트·프로토콜·출발지 기준의 최소 권한 규칙으로 서비스 접근 범위를 제한합니다.", ["외부 공개 포트와 내부 관리 포트를 구분합니다.", "서비스 간 통신에는 IP보다 보안 그룹 참조를 우선 검토합니다."]),
  article("firewall", "Networking", "Firewall", "VPC와 인터넷, 고객 네트워크 사이의 트래픽을 정책으로 제어하는 방화벽입니다.", ["Firewall", "Network Policy", "Ingress", "Egress"], "네트워크 경계에서 허용·차단 정책을 적용해 서비스 통신을 보호합니다.", ["Security Group과 Firewall의 적용 계층을 구분합니다.", "규칙 변경 전후에 서비스 통신과 차단 로그를 점검합니다."]),
  article("load-balancer", "Networking", "Load Balancer", "여러 서버로 유입되는 트래픽을 분산해 서비스 가용성과 확장성을 높이는 서비스입니다.", ["Load Balancer", "Health Check", "Target Group", "Traffic Distribution"], "정상 상태의 서버에만 요청을 전달하고 부하를 여러 대상에 분산합니다.", ["헬스 체크 경로와 성공 기준을 서비스 특성에 맞춰 설정합니다.", "애플리케이션 서버는 Load Balancer를 통해서만 접근하도록 구성합니다."]),
  article("vpn", "Networking", "VPN", "고객 네트워크와 클라우드를 암호화된 가상 전용망으로 연결하는 서비스입니다.", ["VPN", "Site-to-Site", "Encrypted Tunnel", "Hybrid Cloud"], "온프레미스 또는 원격 네트워크와 클라우드 VPC를 안전하게 연결합니다.", ["연결 대상의 CIDR과 라우팅 경로가 겹치지 않도록 검토합니다.", "터널 상태와 통신 가능 여부를 모니터링합니다."]),

  article("block-storage", "Storage", "Block Storage", "서버에 연결하는 디스크 형태의 스토리지로 대규모 데이터 처리와 DB 워크로드에 적합합니다.", ["Block Storage", "Volume", "Database Workload"], "서버의 영속 데이터와 데이터베이스 파일을 저장하는 블록 단위 스토리지입니다.", ["성능·용량 요구사항에 맞는 볼륨 구성을 선택합니다.", "스냅샷·백업과 복구 절차를 함께 점검합니다."]),
  article("file-storage", "Storage", "File Storage", "네트워크를 통해 여러 클라이언트가 파일을 공유할 수 있는 스토리지입니다.", ["File Storage", "Shared File System", "NFS"], "여러 서버가 공통 파일을 읽고 써야 하는 워크로드에 사용합니다.", ["접근 권한과 마운트 대상 서버를 관리합니다.", "동시 접근 시 파일 잠금과 성능 특성을 고려합니다."]),
  article("object-storage", "Storage", "Object Storage", "대용량 객체를 저장하고 제공하는 S3 호환 방식의 스토리지입니다.", ["Object Storage", "S3 Compatible", "Bucket", "Object"], "정적 파일, 로그, 백업 산출물 등 대용량 객체 데이터를 보관합니다.", ["Bucket 정책과 접근 키의 권한을 분리합니다.", "보관 주기와 삭제 정책을 명확히 관리합니다."]),
  article("backup", "Storage", "Backup & Restore", "데이터를 백업하고 복구하는 정책과 실제 복원 검증을 다루는 문서입니다.", ["Backup", "Restore", "Retention", "Recovery"], "서비스와 데이터베이스의 장애·실수·손상 이후 복구 가능한 상태를 만듭니다.", ["보존 주기와 복구 책임자를 명확히 합니다.", "정기적인 Restore 테스트로 데이터 정합성과 연결 상태를 검증합니다."]),

  article("mysql", "Database", "MySQL", "서비스의 트랜잭션 데이터를 정합성 있게 처리하기 위한 관계형 데이터베이스입니다.", ["MySQL", "Replica", "Active-Standby", "HA", "DR"], "사용자·도메인·업무 데이터처럼 일관된 쓰기와 조회가 필요한 서비스 데이터에 사용합니다.", ["Replica와 Active-Standby의 역할과 전환 절차를 명확히 합니다.", "RTO·RPO 기준으로 백업, 복제, 복구 전략을 수립합니다."]),
  article("redis", "Database", "Redis", "빠른 조회와 임시 상태 관리가 필요한 데이터에 사용하는 인메모리 기반 저장소입니다.", ["Redis", "CacheStore", "TTL", "Cache"], "캐시, 세션, 인증 토큰, 짧은 수명의 상태 데이터를 빠르게 처리합니다.", ["TTL을 설정해 만료 데이터가 축적되지 않도록 합니다.", "장애 시 원본 DB를 통해 동작할 수 있는 캐시 전략을 설계합니다."]),
  article("clickhouse", "Database", "ClickHouse", "대량 로그 적재와 분석 쿼리에 적합한 컬럼 기반 데이터베이스입니다.", ["ClickHouse", "Columnar Database", "Analytics", "Kafka Connect"], "서비스 로그와 분석 데이터를 저장하고 빠르게 조회하는 역할을 맡습니다.", ["트랜잭션 DB와 분리해 각 저장소의 성능 특성을 활용합니다.", "적재 과정의 변환 책임과 보관 주기를 함께 설계합니다."]),

  article("kubernetes", "Container", "Kubernetes", "컨테이너화된 애플리케이션을 선언적으로 배포하고 운영하기 위한 오케스트레이션 환경입니다.", ["Kubernetes", "Kubernetes Engine", "YAML", "LoadBalancer"], "클러스터, 워크로드, Service를 YAML로 정의해 운영합니다.", ["Deployment와 Service의 책임을 구분합니다.", "LoadBalancer 노출 시 보안 그룹·포트·헬스 체크를 함께 확인합니다."]),

  article("terraform", "DevOps", "Terraform", "클라우드 인프라를 코드로 정의하고 재현 가능하게 구성하는 IaC 도구입니다.", ["Terraform", "Terraform Registry", "Samsung Cloud Platform Provider", "IaC"], "Provider와 리소스 정의를 이용해 Samsung Cloud Platform 자원을 선언형으로 관리합니다.", ["환경별 변수와 공통 모듈을 분리합니다.", "Plan 결과를 검토한 뒤 변경을 적용합니다."]),
  article("ansible", "DevOps", "Ansible", "서버 내부 설정과 반복 작업을 자동화하는 구성 관리 도구입니다.", ["Ansible", "Playbook", "Configuration Management"], "여러 서버에 동일한 설정과 작업 절차를 일관되게 적용합니다.", ["Playbook을 멱등적으로 작성해 반복 실행의 안전성을 확보합니다.", "인벤토리와 민감한 변수는 분리해 관리합니다."]),
  article("docker", "DevOps", "Docker", "애플리케이션과 실행 의존성을 컨테이너 이미지로 패키징하는 플랫폼입니다.", ["Docker", "Container", "Image", "Dockerfile"], "개발·테스트·운영 환경의 실행 차이를 줄이고 배포 단위를 표준화합니다.", ["이미지 크기와 레이어 구성을 관리합니다.", "환경 변수와 비밀 값은 이미지에 직접 포함하지 않습니다."]),
  article("nginx", "DevOps", "Nginx", "웹 서버와 리버스 프록시로서 요청 라우팅과 트래픽 전환을 담당합니다.", ["Nginx", "Reverse Proxy", "Routing", "SSL"], "클라이언트 요청을 애플리케이션 서버로 전달하고 외부 진입 지점을 관리합니다.", ["업스트림과 헬스 체크, 타임아웃을 서비스 특성에 맞춰 설정합니다.", "TLS 인증서와 보안 헤더를 함께 관리합니다."]),
  article("jenkins", "DevOps", "Jenkins", "코드 변경 후 빌드·테스트·배포 과정을 자동화하는 CI/CD 도구입니다.", ["Jenkins", "CI/CD", "Pipeline", "Build"], "반복되는 검증과 배포 절차를 파이프라인으로 연결합니다.", ["배포 전 테스트와 헬스 체크 단계를 둡니다.", "실패한 빌드·배포의 로그와 롤백 절차를 확인합니다."]),
  article("linux", "DevOps", "Linux", "서비스가 동작하는 서버 운영체제와 자원·프로세스 관리의 기반입니다.", ["Linux", "Process", "Systemd", "Log"], "애플리케이션 실행 환경과 네트워크·파일·프로세스 자원을 관리합니다.", ["CPU, 메모리, 디스크 사용량과 프로세스 상태를 관찰합니다.", "권한, 로그, 서비스 재시작 정책을 함께 관리합니다."]),

  article("kafka", "Data", "Kafka", "이벤트를 비동기로 전달해 서비스 요청과 후속 처리를 분리하는 메시징 플랫폼입니다.", ["Kafka", "Topic", "Partition", "Consumer"], "실시간 요청 처리와 대량 로그 적재를 분리해 병목과 장애 전파를 줄입니다.", ["예상 처리량을 기준으로 토픽과 파티션 수를 검토합니다.", "생산자와 소비자의 책임을 분리해 확장성을 확보합니다."]),
  article("kafka-connect", "Data", "Kafka Connect", "Kafka와 외부 시스템 사이의 데이터 이동을 표준화하는 커넥터 프레임워크입니다.", ["Kafka Connect", "Source Connector", "Sink Connector", "Data Pipeline"], "Source·Sink Connector로 데이터 수집과 적재를 구성합니다.", ["변환 책임을 Sink 단계와 저장소 사이에 명확히 나눕니다.", "실패 재시도와 데이터 형식 변경에 대한 정책을 관리합니다."]),
  article("fastapi", "Data", "FastAPI", "Python 기반 비동기 API를 빠르게 구성하기 위한 웹 프레임워크입니다.", ["FastAPI", "Python", "Async", "API"], "모델 서빙과 데이터 처리 API처럼 비동기 요청 처리가 필요한 기능에 사용합니다.", ["입력·출력 스키마를 명확히 정의합니다.", "긴 작업은 요청 처리와 분리해 비동기 흐름으로 구성합니다."]),

  article("prometheus", "Observability", "Prometheus", "시계열 메트릭을 수집하고 규칙 기반 알림에 활용하는 모니터링 시스템입니다.", ["Prometheus", "Metric", "Alert", "Time Series"], "서버와 애플리케이션의 수치형 상태를 수집해 추세와 이상 징후를 파악합니다.", ["서비스·인프라 관점의 메트릭을 구분해 수집합니다.", "알림 조건은 노이즈를 줄일 수 있게 임계값과 지속 시간을 조정합니다."]),
  article("grafana", "Observability", "Grafana", "메트릭과 로그를 대시보드로 시각화하고 탐색하는 도구입니다.", ["Grafana", "Dashboard", "Visualization", "Alert"], "Prometheus와 Loki 등의 데이터를 한 화면에서 비교하고 운영 현황을 확인합니다.", ["사용자 서비스 지표와 인프라 지표를 분리한 대시보드를 구성합니다.", "장애 대응 시 필요한 쿼리와 패널을 미리 정리합니다."]),
  article("loki", "Observability", "Loki", "애플리케이션과 인프라 로그를 중앙화해 조회·분석하는 로그 저장소입니다.", ["Loki", "Log", "LogQL", "Centralized Logging"], "여러 서버와 컨테이너에서 발생한 로그를 한곳에서 탐색합니다.", ["라벨 설계를 통해 서비스·환경·인스턴스 기준으로 로그를 구분합니다.", "과도한 라벨 카디널리티와 보관 비용을 함께 관리합니다."]),
  article("promtail", "Observability", "Promtail", "로그를 수집해 Loki로 전달하던 에이전트입니다. 기존 구성의 동작을 이해하는 데 유용하지만, 신규 구성에서는 대체 수집기를 검토해야 합니다.", ["Promtail", "Log Collection", "Label", "Loki"], "서버와 컨테이너 로그를 수집해 중앙 로그 저장소에 전송하는 방식으로 사용해 왔습니다.", ["기존 Promtail 구성에서는 수집 경로와 파싱 규칙을 서비스별로 점검합니다.", "Promtail은 2026년 3월 EOL이므로 신규 수집 환경은 Grafana Alloy 등 대체 수집기 전환 계획을 검토합니다.", "민감한 정보가 로그에 남지 않도록 마스킹 정책을 적용합니다."]),

  article("mcp-server", "Backend", "MCP Server", "LLM이 운영 데이터와 기능을 안전하게 사용할 수 있도록 도구 호출을 연결하는 백엔드 계층입니다.", ["MCP 서버", "LLM", "Tool Calling", "ClickHouse"], "메신저 대화 요약과 로그 분석에서 LLM이 필요한 데이터를 조회하고 결과를 활용하도록 연결합니다.", ["허용된 함수만 호출하게 해 데이터 접근 범위를 제한합니다.", "입력값 검증과 호출 기록으로 운영 동작을 추적합니다."]),
  article("java", "Backend", "Java", "도메인 중심 구조와 유지보수성을 고려해 백엔드 서비스를 구현하는 언어와 생태계입니다.", ["Java", "Spring Boot", "Domain", "Clean Code"], "도메인과 책임을 중심으로 패키지와 계층을 분리해 비즈니스 로직을 구성합니다.", ["공통 기능은 별도 모듈로 분리합니다.", "변경 영향이 작은 응집도 높은 코드를 지향합니다."]),
  article("junit", "Backend", "JUnit", "Java 비즈니스 로직의 기대 동작과 예외 상황을 검증하는 단위 테스트 프레임워크입니다.", ["JUnit", "Unit Test", "Test Case", "TDD"], "중요한 도메인 로직을 자동화된 테스트로 검증합니다.", ["정상 흐름과 실패 흐름을 각각 테스트합니다.", "테스트 결과를 바탕으로 코드 구조와 책임을 개선합니다."]),
];

export const scpServiceContexts: Record<string, ScpServiceContext> = {
  vpc: {
    description: "SCP의 VPC는 고객 전용의 논리적으로 분리된 사설 네트워크 공간입니다. 일반적인 클라우드 VPC 개념과 유사하지만, SCP는 General·VPC Endpoint·Local Subnet을 구분해 제공합니다.",
    bullets: ["General Subnet은 Public 또는 Private 용도로 구성할 수 있습니다.", "Local Subnet은 VPC 안의 서버 간 직접 통신만 허용하는 용도입니다.", "NAT Gateway는 SCP에서 General 타입 Subnet에 생성하며, 공인 IP NAT가 없는 Virtual Server의 아웃바운드 인터넷 접근을 위한 대표 공인 IP 매핑 기능을 제공합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/vpc/overview/",
  },
  subnet: {
    description: "SCP VPC는 General, VPC Endpoint, Local Subnet 유형을 제공합니다. General Subnet은 Public 또는 Private 용도로 구성할 수 있으므로, 일반적인 Subnet 설계와 SCP의 유형별 제약을 함께 구분해야 합니다.",
    bullets: ["Public·Private 용도는 SCP General Subnet에서 구성할 수 있습니다.", "VPC Endpoint Subnet은 사설 경로의 서비스 접근을 위한 유형이고, Local Subnet은 VPC 안의 서버 간 직접 통신 용도입니다.", "실제 통신 가능 여부는 Subnet 유형뿐 아니라 Route, Security Group, Firewall 설정을 함께 확인해야 합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/vpc/overview/",
  },
  "internet-gateway": {
    description: "SCP Internet Gateway는 VPC 자원이 인터넷과 통신할 수 있도록 연결하는 게이트웨이입니다. Gateway 연결 자체와 자원의 공개 여부는 별도이므로, 공인 IP와 보안 정책을 함께 설정해야 합니다.",
    bullets: ["Internet Gateway는 VPC 리소스와 인터넷 간 통신 경로를 제공합니다.", "외부 접속에는 공인 IP, 라우팅, Security Group 또는 Firewall 규칙이 함께 필요합니다.", "SCP Firewall은 Internet Gateway에도 적용할 수 있어 네트워크 경계 정책을 분리해 관리할 수 있습니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/vpc/overview/",
  },
  "nat-gateway": {
    description: "SCP NAT Gateway는 공인 IP NAT가 없는 Virtual Server가 인터넷에 접근할 수 있도록 대표 공인 IP를 매핑하는 기능입니다. SCP에서는 General 타입 Subnet에 생성합니다.",
    bullets: ["NAT Gateway는 General 타입 Subnet에서 사용할 수 있습니다.", "공인 IP가 없는 Virtual Server의 아웃바운드 인터넷 접근을 위한 대표 공인 IP 매핑을 제공합니다.", "외부에서 시작하는 접근을 열기 위한 구성과는 목적이 다르므로 Internet Gateway·Security Group 정책과 구분합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/vpc/overview/",
  },
  "vpc-endpoint": {
    description: "SCP VPC는 VPC Endpoint Subnet 유형을 제공합니다. 이 유형은 사설 네트워크 기반의 서비스 접근을 위한 SCP 제품 개념이므로, 일반적인 VPC Endpoint의 구현 방식과 동일하다고 가정하지 않아야 합니다.",
    bullets: ["VPC Endpoint Subnet은 SCP VPC가 제공하는 Subnet 유형 중 하나입니다.", "접근 가능한 서비스와 실제 구성 절차는 해당 SCP 상품 가이드에서 확인해야 합니다.", "사설 경로를 사용하더라도 권한, DNS, 라우팅 정책을 별도로 검증합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/vpc/overview/",
  },
  "vpc-peering": {
    description: "SCP VPC는 VPC Peering을 통해 VPC 간 연결을 구성할 수 있습니다. Peering 이후에도 대상 VPC와 경로·보안 정책을 명시해야 하므로, 연결 생성과 통신 허용을 구분해 설계해야 합니다.",
    bullets: ["SCP VPC는 VPC Peering을 통해 VPC 간 연결 구성을 지원합니다.", "VPC를 독립적으로 운영하면서 필요한 사설 통신 경로만 연결하는 방식으로 사용할 수 있습니다.", "연결 전 CIDR 중복 여부, 연결 후 양측 라우팅과 Security Group 규칙을 함께 점검합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/vpc/overview/",
  },
  "security-group": {
    description: "SCP Security Group은 Virtual Server, Database, Kubernetes Engine 등의 포트에 적용할 수 있는 논리적 방화벽입니다.",
    bullets: ["처음 생성하면 Any/Deny 기본 규칙으로 Inbound와 Outbound가 모두 차단됩니다.", "IP 주소, 프로토콜, 포트를 지정해 필요한 허용 규칙을 추가하는 방식입니다.", "SCP 가이드 기준으로 차단 규칙을 직접 설정하는 기능은 제공하지 않으므로 허용 규칙 설계가 중요합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/security_group/overview/",
  },
  firewall: {
    description: "SCP Firewall은 Internet Gateway, Direct Connect, Load Balancer에 적용해 VPC와 인터넷 또는 고객 네트워크 사이의 트래픽을 제어합니다.",
    bullets: ["초기 상태는 Any/Deny로 모든 Inbound·Outbound 트래픽을 차단합니다.", "방화벽 크기에 따라 규칙 할당량이 다르므로 필요한 규칙 수를 사전에 산정합니다.", "Security Group은 자원 포트 수준, SCP Firewall은 네트워크 경계 대상 수준이라는 차이를 분리해 이해합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/firewall/overview/",
  },
  "load-balancer": {
    description: "SCP Load Balancer는 L4 또는 L7 유형으로 VPC Subnet에 배포되며, 트래픽 증가나 서버 장애 시 가용한 서버에 트래픽을 분산합니다.",
    bullets: ["Listener가 프로토콜·포트·라우팅 규칙을 받아 LB 서버 그룹으로 요청을 전달합니다.", "LB 서버 그룹은 멤버 서버, 부하 분산 방식, 헬스 체크를 묶어 관리합니다.", "L7은 HTTP·HTTPS 라우팅과 리디렉션을, L4는 TCP·UDP·TLS 처리를 지원합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/load_balancer/overview/",
  },
  vpn: {
    description: "SCP VPN은 고객 네트워크와 SCP를 IPsec으로 암호화한 가상 전용망으로 연결하는 서비스입니다.",
    bullets: ["SCP VPN은 Passive Mode로 동작하므로 원격 Peer VPN이 Active Mode로 연결을 시작해야 합니다.", "Virtual Private Gateway와 VPN Tunnel을 구성하며 Gateway당 Tunnel 수 제한을 사전에 확인합니다.", "Active 장비 장애 시 Standby 장비가 동작하는 이중화 구성을 제공합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/networking/vpn/overview/",
  },
  "block-storage": {
    description: "SCP의 일반 Block Storage는 Compute 카테고리에 있는 Virtual Server용 블록 스토리지입니다. Storage 카테고리의 Block Storage(BM)는 별도 Bare Metal 전용 상품이므로 혼용하지 않습니다.",
    bullets: ["볼륨을 Virtual Server에 연결하거나 연결 해제할 수 있으며 OS 볼륨과 데이터 볼륨으로 사용합니다.", "공식 문서 기준 데이터 볼륨은 최소 8GB부터 최대 12TB 범위에서 생성·증설할 수 있습니다.", "Snapshot, Multi Attach, AES-256 기본 암호화, IOPS·Latency·Throughput 모니터링 기능을 제공합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/compute/block_storage_vm/overview/",
  },
  "file-storage": {
    description: "SCP File Storage는 여러 서버가 네트워크로 데이터를 공유하는 환경을 위한 스토리지입니다.",
    bullets: ["데이터 사용량에 따라 용량이 자동으로 증가하거나 축소됩니다.", "Linux는 NFS, Windows는 CIFS 프로토콜을 선택할 수 있습니다.", "제공 리전에서는 Multi-AZ를 선택해 Active Zone 장애 시 Standby Zone의 동일 Mount 정보로 이어서 사용할 수 있습니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/storage/file_storage/overview/",
  },
  "object-storage": {
    description: "SCP Object Storage는 S3 API와 호환되는 객체 스토리지로, 버킷 안에 대용량 파일과 객체를 보관합니다.",
    bullets: ["기본 권한은 Private이며 Public URL은 인터넷에서 누구나 접근할 수 있으므로 목적을 구분해야 합니다.", "버전 관리와 SSE-S3 암호화, 접근 제어, 버킷 복제 기능을 제공합니다.", "접근 키는 API와 S3 호환 도구가 SCP Object Storage를 이용할 때 필요한 인증 수단입니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/storage/object_storage/overview/",
  },
  backup: {
    description: "SCP Backup은 대상, 주기, 보관 기간, 저장 위치를 정책으로 지정해 데이터 백업과 복구를 수행하는 서비스입니다.",
    bullets: ["Agentless Backup은 VM Image처럼 별도 Agent 없이 백업하는 방식입니다.", "Agent Backup은 파일시스템 백업처럼 대상 서버에 Backup Agent 구성이 필요한 방식입니다.", "Full과 Incremental 백업, 원격지 보관, AES-256 암호화 기능을 제공하므로 RPO와 복구 시간을 기준으로 정책을 선택합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/storage/backup/overview/",
  },
  mysql: {
    description: "SCP MySQL(DBaaS)은 Console에서 설치와 운영 기능을 제공하는 관리형 MySQL 서비스입니다. 일반 MySQL 지식과 별도로 SCP가 제공하는 HA·복구 기능을 구분해 이해해야 합니다.",
    bullets: ["Active 변경은 Standby에 동기 복제되고, Active 장애 시 Standby로 자동 Failover되는 구조를 제공합니다.", "읽기 부하 분산과 DR을 위한 Read Replica를 동일·다른 리전에 최대 5개 구성할 수 있습니다.", "백업·복구, 파라미터, 접근 허용 IP, 모니터링과 Object Storage로의 Audit Log 내보내기 기능을 제공합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/database/mysql/overview/",
  },
  redis: {
    description: "SCP CacheStore(DBaaS)는 Redis OSS와 Valkey를 제공하는 관리형 인메모리 데이터 스토어입니다.",
    bullets: ["Sentinel 방식으로 Master와 읽기 전용 Replica를 구성하고 Master 장애 시 자동 Failover를 지원합니다.", "Replica는 1개 또는 2개로 구성할 수 있으며, 백업과 복구 기능도 제공합니다.", "일반 Redis의 데이터 구조·TTL 지식과 SCP의 자동 프로비저닝·Failover 운영 기능은 구분해서 이해합니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/database/cachestore/overview/",
  },
  kubernetes: {
    description: "SCP Kubernetes Engine은 표준 Kubernetes 환경과 Control Plane, Worker Node 기반 Cluster 운영 기능을 제공하는 Container 상품입니다. 일반 Kubernetes 개념과 SCP Console이 제공하는 관리 기능을 구분해 설명합니다.",
    bullets: ["Node Pool별로 동일한 Server Type, Size, OS Image를 적용하며 Cluster에는 최소 1개 이상의 Worker Node가 필요합니다.", "Deployment·Pod·StatefulSet·DaemonSet·Job·CronJob과 Service·Ingress, PV·PVC·StorageClass, ConfigMap·Secret, RBAC 관리 기능을 제공합니다.", "공식 선행 서비스는 VPC, Security Group, Persistent Volume으로 활용하는 File Storage입니다."],
    referenceUrl: "https://docs.e.samsungsdscloud.com/userguide/container/k8s_engine/overview/",
  },
};

export const knowledgeHeadingTargets: Record<string, string> = { Cloud: "vpc", Java: "java", "Infra / DevOps": "terraform", Data: "kafka", Monitoring: "prometheus" };

export const knowledgeKeywordTargets: [string, string][] = [["Samsung Cloud Platform Provider", "terraform"], ["Kubernetes Engine", "kubernetes"], ["Terraform Registry", "terraform"], ["Active-Standby", "mysql"], ["Security Group", "security-group"], ["Internet Gateway", "internet-gateway"], ["NAT Gateway", "nat-gateway"], ["VPC Peering", "vpc-peering"], ["VPC Endpoint", "vpc-endpoint"], ["Load Balancer", "load-balancer"], ["Transit Gateway", "transit-gateway"], ["Local Subnet", "vpc"], ["Block Storage", "block-storage"], ["File Storage", "file-storage"], ["Object Storage", "object-storage"], ["Kafka Connect", "kafka-connect"], ["FastApi", "fastapi"], ["MCP 서버", "mcp-server"], ["ClickHouse", "clickhouse"], ["Prometheus", "prometheus"], ["Grafana", "grafana"], ["Promtail", "promtail"], ["Kubernetes", "kubernetes"], ["LoadBalancer", "load-balancer"], ["Terraform", "terraform"], ["IaC", "terraform"], ["VPC", "vpc"], ["Subnet", "subnet"], ["Firewall", "firewall"], ["VPN", "vpn"], ["Backup", "backup"], ["Replica", "mysql"], ["HA", "mysql"], ["DR", "mysql"], ["Ansible", "ansible"], ["Docker", "docker"], ["Nginx", "nginx"], ["Jenkins", "jenkins"], ["Linux", "linux"], ["LLM", "mcp-server"], ["Kafka", "kafka"], ["MySQL", "mysql"], ["Redis", "redis"], ["Loki", "loki"], ["Java", "java"], ["Junit", "junit"]];
