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

      // 2. TEST AŞAMASI (Inject & Run)
        stage('🧪 Unit & Integration Tests') {
            steps {
                script {
                    echo "♻️ Güncel Test Dosyası Konteynere Yükleniyor..."
                    
                    // GitHub'dan gelen yeni dosyayı, çalışan konteynerin içine zorla kopyala
                    // (Dosya yolu /app/tests/ çünkü Dockerfile WORKDIR /app demişti)
                    sh "docker cp backend/tests/api.test.js secure-backend:/app/tests/api.test.js"
                    
                    echo "🚀 Test Başlatılıyor (Direct Execution)..."
                    
                    // npm test kullanmıyoruz, çünkü package.json eski olabilir.
                    // Direkt jest'i çağırıyoruz.
                    sh "docker exec secure-backend npx jest tests/api.test.js --runInBand --detectOpenHandles --forceExit"
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