# Backend Free Deployment Learning Plan

Muc tieu: bien backend Spring Boot multi-module hien tai thanh mot flow CI/CD hoc duoc end-to-end, dung cac cong cu mien phi:

1. Docker Compose
2. Jenkins chay bang Docker
3. Docker Registry: Docker Hub
4. Kubernetes local: Minikube hoac Kind
5. Helm
6. OpenSearch stack de log/search/observe

Backend entrypoint hien tai la module `backend:server`, class chay chinh:

```text
org.example.server.ServerApplication
```

Jar can build:

```bash
./gradlew :backend:server:bootJar
```

## Luong Tong The

```text
Developer
  -> git commit
  -> Jenkins container
  -> Gradle test/build
  -> Docker build backend image
  -> Docker Hub push image
  -> Minikube/Kind pull image
  -> Helm upgrade/install
  -> Backend + PostgreSQL + OpenSearch local
```

## Cau Truc File Se Them Vao Backend

```text
backend/
  Dockerfile
  .dockerignore
  Jenkinsfile
  docker-compose.yml
  docker-compose.jenkins.yml
  docker-compose.observability.yml
  helm/
    backend/
      Chart.yaml
      values.yaml
      templates/
        deployment.yaml
        service.yaml
        configmap.yaml
        secret.yaml
        ingress.yaml
        _helpers.tpl
  k8s/
    namespace.yaml
  docs/
    01-docker-compose.md
    02-jenkins-docker.md
    03-docker-hub.md
    04-kubernetes-local.md
    05-helm.md
    06-opensearch.md
```

Nen implement tung phan theo thu tu tren. Moi phan nen co command verify rieng de tranh debug qua nhieu tang cung luc.

## Phase 1: Docker Hoa Backend

Muc tieu: dong goi `backend:server` thanh Docker image chay duoc local.

Viec can lam:

- Tao `backend/Dockerfile` multi-stage.
- Stage build dung Gradle wrapper va Java 17.
- Stage runtime dung JRE nhe hon.
- Copy jar tu `backend/server/build/libs/*.jar`.
- Dung bien moi truong cho DB thay vi hard-code `localhost`.

Dieu can sua trong app config:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/spring_and_angular_practice}
    username: ${SPRING_DATASOURCE_USERNAME:postgres}
    password: ${SPRING_DATASOURCE_PASSWORD:postgres}
```

Command hoc:

```bash
cd /Users/thong/Desktop/spring-and-angular
./gradlew :backend:server:bootJar
docker build -f backend/Dockerfile -t spring-angular-backend:local .
docker run --rm -p 8080:8080 spring-angular-backend:local
```

Note hoc flow:

- Docker image khong nen phu thuoc vao database `localhost`, vi `localhost` trong container la chinh container do.
- Config runtime nen di qua environment variables.
- Dockerfile nen nam o `backend/`, nhung build context nen la repo root vi Gradle multi-module can thay toan bo project.

## Phase 2: Docker Compose Cho Local Stack

Muc tieu: chay backend + PostgreSQL bang mot lenh.

Viec can lam:

- Tao `backend/docker-compose.yml`.
- Service `postgres` dung volume local.
- Service `backend` build tu Dockerfile.
- Dung healthcheck cho PostgreSQL.
- Backend depends_on PostgreSQL healthy.

Service de xuat:

```text
backend-app
postgres
```

Command hoc:

```bash
cd /Users/thong/Desktop/spring-and-angular/backend
docker compose up --build
docker compose down
docker compose down -v
```

Note hoc flow:

- Compose la moi truong local/dev, chua phai deployment that.
- Volume giu data PostgreSQL qua moi lan restart.
- `docker compose down -v` xoa data volume, chi dung khi muon reset DB.

## Phase 3: Jenkins Chay Bang Docker

Muc tieu: Jenkins tu dong build/test/package backend.

Viec can lam:

- Tao `backend/docker-compose.jenkins.yml`.
- Chay Jenkins LTS container.
- Mount Docker socket neu muon Jenkins build/push Docker image.
- Tao volume `jenkins_home`.
- Tao `backend/Jenkinsfile`.

Pipeline de xuat:

```text
Checkout
  -> Test
  -> Build Jar
  -> Build Docker Image
  -> Login Docker Hub
  -> Push Docker Image
```

Command hoc:

```bash
cd /Users/thong/Desktop/spring-and-angular/backend
docker compose -f docker-compose.jenkins.yml up -d
docker logs jenkins
```

Credential can tao trong Jenkins:

```text
dockerhub-username
dockerhub-token
```

Note hoc flow:

- Dung Docker Hub access token, khong dung password tai khoan.
- Neu mount `/var/run/docker.sock`, Jenkins co quyen dieu khien Docker tren may host. Cach nay tien cho local learning, khong nen xem la production-secure.
- Jenkinsfile nen nam trong source code de CI pipeline versioned theo code.

## Phase 4: Push Image Len Docker Hub

Muc tieu: co image public/private tren Docker Hub de Kubernetes local pull ve.

Viec can lam:

- Tao Docker Hub repository, vi du: `your-dockerhub-user/spring-angular-backend`.
- Jenkins build tag theo commit SHA.
- Co them tag `latest` chi cho branch chinh neu can.

Tag de xuat:

```text
your-dockerhub-user/spring-angular-backend:<git-sha>
your-dockerhub-user/spring-angular-backend:latest
```

Command hoc:

```bash
docker login
docker tag spring-angular-backend:local your-dockerhub-user/spring-angular-backend:local
docker push your-dockerhub-user/spring-angular-backend:local
docker pull your-dockerhub-user/spring-angular-backend:local
```

Note hoc flow:

- Docker Hub Personal plan co the hoc free, dac biet voi public repo.
- Public image khong duoc chua secret.
- Gioi han pull cua Docker Hub co the anh huong khi rebuild/pull nhieu lan; khi hoc local thuong khong sao, nhung nen login de tang han muc.

## Phase 5: Kubernetes Local Bang Minikube Hoac Kind

Muc tieu: chay backend trong Kubernetes local.

Lua chon:

- Minikube: de hoc tung thanh phan, co dashboard, addon tien.
- Kind: nhe, nhanh, hop voi CI/local cluster disposable.

Khuyen nghi cho project nay:

```text
Minikube truoc de hoc concept, Kind sau de hoc CI-style cluster.
```

Viec can lam:

- Tao namespace `spring-angular`.
- Deploy PostgreSQL bang Helm chart co san hoac manifest don gian.
- Deploy backend image tu Docker Hub.
- Expose bang `Service` type `NodePort` hoac `minikube service`.

Command hoc voi Minikube:

```bash
minikube start
kubectl create namespace spring-angular
kubectl get nodes
kubectl get pods -n spring-angular
minikube service backend -n spring-angular
```

Command hoc voi Kind:

```bash
kind create cluster --name spring-angular
kubectl cluster-info --context kind-spring-angular
kubectl get nodes
```

Note hoc flow:

- Kubernetes khong build code; Kubernetes chi chay image da build.
- Image tag nen immutable, vi du commit SHA, de rollback va debug de hon.
- Secret trong Kubernetes nen tach khoi ConfigMap.

## Phase 6: Helm Chart Cho Backend

Muc tieu: thay vi apply nhieu YAML rieng le, dung Helm de package deployment.

Viec can lam:

- Tao chart `backend/helm/backend`.
- Template cac resource:
  - Deployment
  - Service
  - ConfigMap
  - Secret
  - Ingress optional
- Dua image repository/tag vao `values.yaml`.
- Dua DB config vao `values.yaml`, nhung password qua Secret.

Command hoc:

```bash
cd /Users/thong/Desktop/spring-and-angular/backend
helm lint helm/backend
helm template backend helm/backend
helm upgrade --install backend helm/backend -n spring-angular --create-namespace
helm uninstall backend -n spring-angular
```

Note hoc flow:

- `helm template` giup xem YAML render ra truoc khi deploy.
- `helm upgrade --install` la command CI/CD hay dung vi chay duoc ca lan dau va cac lan update.
- `values.yaml` la noi chinh de bien chart thanh reusable.

## Phase 7: OpenSearch / ELK Local

Muc tieu: co observability stack local de xem log/search.

Khuyen nghi mien phi:

```text
OpenSearch + OpenSearch Dashboards
```

Ly do:

- OpenSearch la open-source va phu hop learning free.
- ELK hien dai co nhieu license/feature can doc ky hon. Neu muc tieu la free learning, OpenSearch it gay nham lan hon.

Viec can lam:

- Tao `backend/docker-compose.observability.yml`.
- Chay:
  - OpenSearch single-node
  - OpenSearch Dashboards
- Ban dau day log bang Docker logging/manual curl.
- Sau do co the them Fluent Bit hoac Logstash neu muon hoc pipeline log chuan hon.

Command hoc:

```bash
cd /Users/thong/Desktop/spring-and-angular/backend
docker compose -f docker-compose.observability.yml up -d
docker compose -f docker-compose.observability.yml down
```

Note hoc flow:

- OpenSearch can RAM kha nhieu; neu may yeu, chay sau cung.
- Observability nen la phase rieng de tranh lam phuc tap deployment ban dau.
- Nen hoc query log va index truoc, roi moi them collector.

## Phase 8: Jenkins Deploy Bang Helm

Muc tieu: Jenkins build image, push Docker Hub, roi deploy vao Minikube/Kind bang Helm.

Pipeline cuoi cung:

```text
Checkout
  -> Test
  -> Build Jar
  -> Build Docker Image
  -> Push Docker Hub
  -> Helm lint
  -> Helm upgrade --install
  -> Smoke test
```

Them Jenkins credentials:

```text
dockerhub-username
dockerhub-token
kubeconfig-local
```

Note hoc flow:

- Jenkins container can truy cap Kubernetes cluster local. Cach de hoc:
  - mount kubeconfig vao Jenkins container, hoac
  - chay Jenkins tren host network tuy OS ho tro.
- Tren macOS, Docker container khong thay Minikube giong Linux host. Neu gap kho, deploy Helm tu host truoc, roi moi noi Jenkins sau.
- CI/CD local co gia tri hoc flow, nhung khong phai production architecture.

## Thu Tu Implement De It Loi Nhat

1. Sua `application.yaml` de dung environment variables.
2. Them Dockerfile va build image local.
3. Them Compose backend + PostgreSQL.
4. Them Jenkins Docker Compose.
5. Them Jenkinsfile build/test/image.
6. Push image len Docker Hub.
7. Chay Minikube va deploy manual bang `kubectl`.
8. Tao Helm chart va deploy bang Helm.
9. Them OpenSearch Compose.
10. Cho Jenkins deploy bang Helm.

## Checklist Verify

```text
[ ] ./gradlew :backend:server:test pass
[ ] ./gradlew :backend:server:bootJar pass
[ ] docker build backend image pass
[ ] docker compose backend + postgres up pass
[ ] Jenkins mo duoc tren browser
[ ] Jenkins pipeline test/build pass
[ ] Docker Hub co image tag moi
[ ] Minikube/Kind cluster pull duoc image
[ ] Helm chart lint pass
[ ] Helm deploy backend pass
[ ] Backend call API duoc trong Kubernetes
[ ] OpenSearch Dashboards mo duoc
[ ] Co log backend trong OpenSearch
```

## Cac Diem Can Nho

- Docker Compose giai quyet local dependencies.
- Jenkins giai quyet automation.
- Docker Hub giai quyet image distribution.
- Kubernetes giai quyet container orchestration.
- Helm giai quyet packaging Kubernetes resources.
- OpenSearch giai quyet search/observability cho log.
- Secret khong commit vao Git.
- Image tag theo commit SHA tot hon chi dung `latest`.
- Moi phase nen co mot command verify rieng.

## Tai Lieu Chinh Thuc Nen Doc

- Docker Hub usage and plans: https://docs.docker.com/docker-hub/usage/
- Jenkins official Docker image: https://hub.docker.com/r/jenkins/jenkins
- Minikube start guide: https://minikube.sigs.k8s.io/docs/start/
- Kind quick start: https://kind.sigs.k8s.io/docs/user/quick-start/
- Helm quickstart: https://helm.sh/docs/intro/quickstart/
- OpenSearch Docker install: https://docs.opensearch.org/docs/latest/install-and-configure/install-opensearch/docker/
