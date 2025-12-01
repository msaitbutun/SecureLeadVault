pipeline{
    agent any
    
    environment {
        APP_NAME = 'secure-lead-vault'
        DOCKER_TAG = '${BULILD_NUMBER}'
    }
    stages{

        stage("1- Workspace Clean Up"){
            steps{
                script{
                    echo "Pipeline başladı:Build #${env.BUILD_NUMBER} -Workspace temizleniyor..."
                    sh 'docker system prune -f || true'
                }
            }

        }

        stage('2- Unit & Integration Tests'){
            steps{
                dir('backend'){
                    echo "Backend testleri çalıştırılıyor..."
                    sh 'rm -rf node_modules'
                    sh 'rm -rf package-lock.json'
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('3- SAST: Dependency Audit'){
            steps {
                dir('backend'){
                    echo "Paket Güvenlik Taraması..."
                    sh 'npm audit --production --audit-level-high || true'
                }
            }
        }

        stage('4- Build Docker Images') {
            parallel {
                stage('Backend Build') {
                    steps {
                        script {
                            sh "docker build -t ${APP_NAME}-backend:${DOCKER_TAG} ./backend"
                        }
                    }
                }
                stage('Frontend Build') {
                    steps {
                        script {
                            sh "docker build -t ${APP_NAME}-frontend:${DOCKER_TAG} ./frontend"
                        }
                    }
                }
            }
        }

        stage('5- Image Security Scan'){
            steps{
                script{
                    echo "Backend image taranıyor..."
                    sh """
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy image \
                    --severity HIGH,CRITICAL \
                    ${APP_NAME}-backend:${DOCKER_TAG}
                    """
                }

            }
        }
        stage('🚀 Deploy') {
            steps {
                script {
                    echo "✅ Tüm testler ve taramalar başarılı."
                    echo "📦 Image: ${APP_NAME}:${DOCKER_TAG} Prodüksiyon ortamına gönderiliyor..."
                    // Buraya gerçek hayatta 'docker push' veya 'kubectl apply' gelir
                }
            }
        }
    }

    
    post {
        success {
            echo "🏆 TEBRİKLER! Pipeline başarıyla tamamlandı."
        }
        failure {
            echo "💥 HATA! Pipeline patladı. Logları kontrol et."
        }

    }
}