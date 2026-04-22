pipeline {
    agent any

    environment {
        IMAGE = "devclubwmu/devclub-prod-v2:${env.GIT_COMMIT.take(7)}"
        LATEST = "devclubwmu/devclub-prod-v2:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t $IMAGE -t $LATEST .'
            }
        }

        stage('Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $IMAGE'
                    sh 'docker push $LATEST'
                }
            }
        }

        stage('Deploy') {
            agent { label 'devwmu-prod-node' }
            steps {
                dir('/home/devwmu-admin/devwmu') {
                    sh 'git pull origin prod'
                    sh 'docker compose down'
                    sh 'docker compose pull'
                    sh 'docker compose up -d'
                }
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Deployed successfully!'
        }
    }
}
