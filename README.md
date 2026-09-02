# Internal Developer Platform

A production-inspired **Internal Developer Platform (IDP)** built on AWS using **Terraform, Kubernetes, Docker, GitHub Actions, Argo CD, Prometheus, and Grafana**.

The project demonstrates how modern DevOps teams can automate infrastructure provisioning, application delivery, GitOps-based Kubernetes deployments, monitoring, and cloud security through a single workflow.

> **Project goal:** Build a lightweight, self-hosted developer platform that provides an automated path from source code to a running, monitored application on Kubernetes.

---

## Architecture

```text
                         Developer
                             |
                             | git push
                             v
                    +-------------------+
                    |     GitHub        |
                    | Application Code  |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |   GitHub Actions  |
                    |   CI Pipeline     |
                    +---------+---------+
                              |
                    OIDC Authentication
                              |
                              v
                    +-------------------+
                    |      AWS ECR      |
                    |  Container Image  |
                    +---------+---------+
                              |
                              | Image
                              v
+----------------------------------------------------------------+
|                           AWS VPC                              |
|                                                                |
|   +-------------------- EC2 -------------------------------+   |
|   |                                                        |   |
|   |                     k3s Kubernetes                     |   |
|   |                                                        |   |
|   |   +-------------+      +---------------------------+   |   |
|   |   |   Argo CD   |----->| Kubernetes Application    |   |   |
|   |   |   GitOps    |      | Deployment / Service      |   |   |
|   |   +-------------+      +---------------------------+   |   |
|   |                                                        |   |
|   |   +-------------+      +---------------------------+   |   |
|   |   | Prometheus  |----->|        Grafana            |   |   |
|   |   | Monitoring  |      | Dashboards                |   |   |
|   |   +-------------+      +---------------------------+   |   |
|   |                                                        |   |
|   +--------------------------------------------------------+   |
|                                                                |
+----------------------------------------------------------------+

                         Terraform
                             |
                             v
                     AWS Infrastructure
                   VPC / EC2 / IAM / ECR
```

---

## Screenshots & Demo

### AWS Infrastructure
<img width="1902" height="797" alt="1 EC2 instance" src="https://github.com/user-attachments/assets/fe7f9af9-b197-4daf-b039-98d616601775" />
<img width="1917" height="836" alt="2 ECR" src="https://github.com/user-attachments/assets/054f1008-18a9-4f96-a655-b8f9c0f2a640" />
<img width="1917" height="835" alt="3 Security Groups" src="https://github.com/user-attachments/assets/328a1733-eefd-487f-a28f-6002064df584" />
<img width="1917" height="881" alt="4 VPC" src="https://github.com/user-attachments/assets/a7a11d08-65cd-48f2-b663-1f19f909a908" />
<img width="1917" height="827" alt="5 IAM Roles" src="https://github.com/user-attachments/assets/9234fa9b-9589-4552-a5ed-dfaefb44f7de" />

## Project Overview

This project combines infrastructure, application delivery, Kubernetes orchestration, GitOps, and monitoring into a single DevOps platform.

The platform provides:

* Automated AWS infrastructure provisioning
* Containerized application deployment
* CI pipeline using GitHub Actions
* Passwordless AWS authentication using GitHub OIDC
* Kubernetes orchestration with k3s
* GitOps deployment using Argo CD
* Automatic HTTPS using cert-manager and Let's Encrypt
* Prometheus-based monitoring
* Grafana dashboards
* AWS IAM and Security Group controls
* Resource optimization for constrained infrastructure

The entire platform was designed with **AWS Free Tier constraints and cost awareness** in mind.

---

# Technology Stack

### Cloud & Infrastructure

* AWS
* Terraform
* Amazon EC2
* Amazon ECR
* VPC
* IAM
* AWS Systems Manager

### Containers & Kubernetes

* Docker
* Kubernetes
* k3s
* Kubernetes Deployments
* Services
* Ingress
* RBAC

### CI/CD & GitOps

* GitHub Actions
* GitHub OIDC
* Argo CD
* GitOps

### Monitoring

* Prometheus
* Grafana
* Kubernetes API metrics
* cAdvisor metrics

### Security

* IAM least privilege
* GitHub OIDC federation
* AWS Security Groups
* Restricted SSH access
* Restricted Kubernetes API access
* Kubernetes RBAC
* TLS / HTTPS
* Let's Encrypt

---

# Repository Structure

```text
internal-developer-platform/
│
├── idp-app/
│   ├── .github/
│   │   └── workflows/
│   │       └── deploy.yml
│   ├── Dockerfile
│   └── app.js
│
├── idp-k8s/
│   ├── argocd-app.yaml
│   ├── cluster-issuer.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   │
│   ├── prometheus-config.yaml
│   ├── prometheus-deployment.yaml
│   ├── prometheus-rbac.yaml
│   ├── grafana-deployment.yaml
│   └── monitoring-values.yaml
│
├── idp-terraform/
│   ├── providers.tf
│   ├── vpc.tf
│   ├── subnet.tf
│   ├── internet-gateway.tf
│   ├── route-table.tf
│   ├── security-group.tf
│   ├── ec2.tf
│   ├── iam.tf
│   ├── github-oidc.tf
│   ├── ecr.tf
│   ├── key-pair.tf
│   └── user_data.sh
│
└── README.md
```

---

# 1. Infrastructure as Code

Terraform provisions the AWS infrastructure required by the platform.

### AWS resources

* VPC
* Public subnet
* Internet Gateway
* Route table
* Security Group
* EC2 instance
* IAM roles and policies
* GitHub OIDC provider
* ECR repository
* AWS Systems Manager access

The infrastructure is reproducible and can be created or destroyed using Terraform rather than manually configuring AWS resources.

### Why Terraform?

Terraform provides:

* Infrastructure reproducibility
* Version-controlled infrastructure
* Automated provisioning
* Easier environment rebuilding
* Infrastructure change tracking

---

# 2. Kubernetes with k3s

Instead of using Amazon EKS, the platform runs **k3s** on an EC2 instance.

### Why k3s?

EKS introduces additional control-plane costs that are unnecessary for this learning and portfolio environment.

k3s provides a lightweight Kubernetes distribution suitable for running on a resource-constrained EC2 instance while maintaining the standard Kubernetes API and deployment workflow.

The platform was intentionally tested under limited CPU and memory conditions.

---

# 3. Containerized Application

The application is a lightweight Node.js HTTP service.

It provides:

* Application status information
* Hostname
* Uptime
* Timestamp
* `/health` endpoint

The hostname is particularly useful when running multiple replicas because it allows the response to identify which Kubernetes pod handled a request.

The application is packaged using Docker with a lightweight Alpine-based Node.js image.

---

# 4. CI Pipeline

The application uses GitHub Actions for continuous integration and image publishing.

```text
Developer
   |
   | git push
   v
GitHub
   |
   v
GitHub Actions
   |
   | Build Docker Image
   v
Docker Image
   |
   | Tag with Git commit SHA
   v
Amazon ECR
```

Each image is tagged using the triggering commit SHA.

This provides traceability between:

```text
Git Commit
     ↓
Docker Image
     ↓
Kubernetes Deployment
     ↓
Running Application
```

---

# 5. Secure AWS Authentication with GitHub OIDC

The CI pipeline does **not** store long-lived AWS access keys.

Instead:

```text
GitHub Actions
       |
       | OIDC Identity Token
       v
AWS IAM
       |
       | Temporary Credentials
       v
Amazon ECR
```

The IAM trust policy restricts which GitHub repository can assume the role.

This reduces the security risk associated with storing permanent AWS credentials in CI/CD systems.

---

# 6. GitOps with Argo CD

Argo CD manages Kubernetes deployments using the GitOps model.

```text
Git Repository
      |
      | Kubernetes manifests
      v
   Argo CD
      |
      v
 Kubernetes Cluster
      |
      v
 Running Application
```

Git acts as the **single source of truth** for the Kubernetes configuration.

When the Kubernetes manifests change, Argo CD detects the difference between Git and the cluster and synchronizes the desired state.

The application can therefore be updated by changing the Kubernetes configuration in Git rather than manually running deployment commands.

---

# 7. HTTPS with cert-manager

The platform uses:

* Kubernetes Ingress
* cert-manager
* Let's Encrypt

to automatically obtain and manage TLS certificates.

```text
Internet
   |
   | HTTPS
   v
Ingress
   |
   v
Kubernetes Service
   |
   v
Application Pods
```

This demonstrates automated HTTPS certificate management in a Kubernetes environment.

---

# 8. Monitoring with Prometheus & Grafana

The platform includes a lightweight monitoring stack.

```text
Kubernetes Cluster
        |
        | Metrics
        v
   Prometheus
        |
        | Query
        v
     Grafana
```

Prometheus collects metrics from the Kubernetes environment, while Grafana provides dashboards for visualization.

Monitoring focuses on practical metrics such as:

* CPU usage
* Memory usage
* Network I/O
* Kubernetes workload information
* Application and cluster health

### Why not kube-prometheus-stack?

The full `kube-prometheus-stack` contains several components and large CRDs that created significant resource pressure on the constrained EC2 instance.

Instead, this project uses a lightweight Prometheus + Grafana configuration.

This was an intentional engineering trade-off:

> **Optimize the monitoring architecture for the available infrastructure rather than simply deploying the largest standard monitoring stack.**

---

# 9. Networking & Security

The project also demonstrates practical networking and security concepts.

### Network Architecture

```text
                    Internet
                       |
                       v
                 Internet Gateway
                       |
                       v
                  Public Subnet
                       |
                       v
                    EC2 / k3s
                       |
             +---------+---------+
             |                   |
             v                   v
        Application          Kubernetes
        Traffic              Services
```

### Security controls

* SSH restricted to an administrator IP
* Kubernetes API restricted to an administrator IP
* HTTP/HTTPS exposed for application access
* IAM roles instead of long-lived credentials
* GitHub OIDC federation
* ECR access scoped through IAM
* Kubernetes RBAC
* TLS certificates
* AWS Systems Manager for instance management

The Security Group follows a least-access approach rather than exposing administrative ports globally.

---

# 10. Resource & Cost Optimization

A major design goal was keeping the platform suitable for a constrained/free-tier environment.

### Design decisions

**k3s instead of EKS**

Reduces Kubernetes infrastructure overhead and avoids EKS control-plane costs.

**No NAT Gateway**

A NAT Gateway introduces hourly and data-processing charges. The architecture therefore avoids one by using a public subnet.

**Lightweight monitoring**

Prometheus and Grafana were configured with resource limits appropriate for a small EC2 instance.

**ECR lifecycle policy**

Old container images can be automatically removed to control repository storage usage.

**AWS Systems Manager**

Allows remote instance management without depending exclusively on publicly exposed SSH access.

---

# 11. Deployment Workflow

The complete workflow is:

```text
1. Developer changes application code
                |
                v
2. Git push to GitHub
                |
                v
3. GitHub Actions starts
                |
                v
4. Docker image is built
                |
                v
5. GitHub authenticates with AWS using OIDC
                |
                v
6. Image is pushed to Amazon ECR
                |
                v
7. Kubernetes configuration is managed through Git
                |
                v
8. Argo CD detects desired-state changes
                |
                v
9. Kubernetes deploys the application
                |
                v
10. Prometheus collects metrics
                |
                v
11. Grafana visualizes platform health
```

This creates an automated path from **code commit → container image → Kubernetes deployment → monitoring**.

---

# 12. Infrastructure Deployment

Initialize Terraform:

```bash
cd idp-terraform
terraform init
```

Review the infrastructure:

```bash
terraform plan
```

Create the infrastructure:

```bash
terraform apply
```

After the infrastructure is created, the Kubernetes and GitOps components can be configured on the k3s cluster.

---

# 13. Local Application Development

Run the Node.js application locally:

```bash
cd idp-app
node app.js
```

Or build the Docker image:

```bash
docker build -t idp-app:local .
```

Run the container:

```bash
docker run -p 3000:3000 idp-app:local
```

Then open:

```text
http://localhost:3000
```

---

# 14. Teardown

The infrastructure can be removed using:

```bash
cd idp-terraform
terraform destroy
```

> **Important:** Before destroying the infrastructure, ensure that resources such as ECR images and other billable AWS resources are handled appropriately.

---

# 15. Engineering Challenges

This project was not designed only as a tutorial implementation. Several practical infrastructure constraints had to be addressed.

### Resource pressure

Running Kubernetes, Argo CD, Prometheus, Grafana, and application workloads on a small EC2 instance caused genuine memory pressure.

This required:

* Resource requests and limits
* Lightweight monitoring
* Service optimization
* Removing unnecessary components
* Testing under constrained resources

### Monitoring architecture

The initial approach using the full Prometheus Operator stack was too heavy for the target environment.

The solution was to implement a smaller Prometheus + Grafana architecture.

### Secure CI/CD authentication

Instead of storing AWS access keys, GitHub Actions was integrated with AWS IAM using OIDC federation.

### Infrastructure cost control

The architecture deliberately avoids expensive services such as NAT Gateway and EKS control-plane resources.

These constraints made the project an exercise in **real infrastructure decision-making rather than simply deploying services without considering cost or resources**.

---

# 16. Key DevOps Concepts Demonstrated

This project demonstrates practical experience with:

* Infrastructure as Code
* Cloud infrastructure
* AWS networking
* IAM
* Containerization
* Kubernetes
* Kubernetes networking
* CI/CD
* GitHub Actions
* OIDC authentication
* GitOps
* Argo CD
* Infrastructure security
* TLS automation
* Monitoring
* Resource management
* Cost optimization
* Troubleshooting

---

# 17. Project Outcome

The final platform provides an automated DevOps workflow where a developer can:

```text
Write Code
    ↓
Push to GitHub
    ↓
Build Container
    ↓
Authenticate to AWS securely
    ↓
Push Image to ECR
    ↓
Synchronize Kubernetes through Argo CD
    ↓
Run Application on k3s
    ↓
Monitor with Prometheus & Grafana
```

The project demonstrates how infrastructure, application delivery, Kubernetes, security, GitOps, and monitoring can be integrated into a single platform.

---

## Author

**Udeesha Jayendra**

---

## License

This project is intended for educational and portfolio purposes.
