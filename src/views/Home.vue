<template>
  <div class="home-page">
    <section class="hero-section py-5 bg-gradient">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <h1 class="display-4 fw-bold mb-4">Logistik E-Learning</h1>
            <p class="lead mb-4">
              Willkommen auf der interaktiven Lernplattform für Logistik-Methoden an der HTW Berlin.  
              Vertiefen Sie Ihr Wissen durch praxisnahe Übungen – von Bestandsanalyse bis Entscheidungsfindung.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <router-link to="/abc-xyz" class="btn btn-primary btn-lg px-4">
                Jetzt starten
                <i class="mdi mdi-arrow-right ms-2"></i>
              </router-link>
              <a href="#features" class="btn btn-outline-primary btn-lg px-4">
                Mehr erfahren
              </a>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <div class="hero-image-container">
              <img 
                src="../assets/wp.png" 
                alt="HTW Berlin Campus" 
                class="img-fluid rounded-4 shadow"
                loading="lazy"
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="features" class="py-5 bg-light">
      <div class="container py-5">
        <h2 class="text-center mb-5 section-title">Meine Lernmodule</h2>
        <div class="row justify-content-center g-4">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="col-sm-8 col-md-6 col-lg-4"
            :class="{ 'animate-fade-in': animated }"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
          >
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body text-center p-4">
                <div class="icon-wrapper mb-3">
                  <i :class="[feature.icon, 'display-4 text-primary']"></i>
                </div>
                <h3 class="h5 mb-3">{{ feature.title }}</h3>
                <p class="text-muted mb-4">{{ feature.description }}</p>
                <router-link :to="feature.link" class="btn btn-sm btn-outline-primary">
                  Zum Modul
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-5">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <img
              src="../assets/htw.png"
              alt="Über uns"
              class="img-fluid rounded-4 shadow"
              loading="lazy"
            >
          </div>
          <div class="col-lg-6 ps-lg-5">
            <h2 class="mb-4 section-title">Über dieses Projekt</h2>
            <p class="mb-4">
              Diese Webseite wurde von Cedric Arnhold (586354) an der HTW Berlin entwickelt, um die Studienleistung "E-Learning in der Produktionswirtschaft/Logistik" zu absolvieren.
            </p>
            <p class="mb-4">
              Theorie trifft Praxis: Lernen Sie Analysemethoden kennen und wenden Sie sie direkt an.
            </p>
            <div class="d-flex align-items-center">
              <img
                src="../assets/logo.png"
                alt="HTW Berlin"
                height="40"
                class="me-3"
                loading="lazy"
              >
              <div>
                <p class="mb-0 fw-bold">Hochschule für Technik und Wirtschaft Berlin</p>
                <p class="mb-0 small text-muted">Fachbereich 4 Informatik, Kommunikation und Wirtschaft</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="zielkonflikt" class="py-5 bg-light">
      <div class="container py-5">
        <h2 class="text-center mb-4 section-title">Zielkonflikt in der Logistik</h2>
        <p class="lead text-center mb-5">
          Zielkonflikte treten auf, wenn sich Logistikziele gegenseitig beeinträchtigen.
        </p>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-body">
                <h3 class="h5 mb-3">Was ist ein Zielkonflikt?</h3>
                <p>
                  Ein Zielkonflikt entsteht, wenn die Erreichung eines Ziels die Erfüllung eines anderen einschränkt.
                </p>
                <ul class="list-unstyled mb-0">
                  <li class="mb-2"><i class="mdi mdi-circle-medium me-2 text-primary"></i>Kostenminimierung</li>
                  <li class="mb-2"><i class="mdi mdi-circle-medium me-2 text-primary"></i>Qualitätssicherung</li>
                  <li class="mb-2"><i class="mdi mdi-circle-medium me-2 text-primary"></i>Liefertreue</li>
                  <li class="mb-2"><i class="mdi mdi-circle-medium me-2 text-primary"></i>Flexibilität</li>
                  <li><i class="mdi mdi-circle-medium me-2 text-primary"></i>Umweltverträglichkeit</li>
                </ul>
              </div>
            </div>
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-body">
                <h3 class="h5 mb-3">Typische Beispiele</h3>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <h6>Kosten vs. Qualität</h6>
                    <p>Mehr Qualität ➜ höhere Kosten; Kosten senken ➜ Qualität leidet.</p>
                  </div>
                  <div class="col-md-6 mb-3">
                    <h6>Geschwindigkeit vs. Kosten</h6>
                    <p>Schnelle Lieferungen erfordern höhere Bestände oder teurere Transportmittel.</p>
                  </div>
                  <div class="col-md-6 mb-3">
                    <h6>Flexibilität vs. Effizienz</h6>
                    <p>Hohe Flexibilität kann standardisierte, effiziente Abläufe stören.</p>
                  </div>
                  <div class="col-md-6 mb-3">
                    <h6>Ökologie vs. Ökonomie</h6>
                    <p>Umweltfreundliche Lösungen sind oft mit höheren Kosten verbunden.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="card shadow-sm border-0">
              <div class="card-body">
                <h3 class="h5 mb-3">Lösungsansätze</h3>
                <ul class="list-unstyled mb-0">
                  <li class="mb-2"><i class="mdi mdi-check-circle-outline me-2 text-success"></i>Strategische Priorisierung</li>
                  <li class="mb-2"><i class="mdi mdi-check-circle-outline me-2 text-success"></i>Win-Win-Situationen suchen</li>
                  <li class="mb-2"><i class="mdi mdi-check-circle-outline me-2 text-success"></i>Kompromissfindung</li>
                  <li class="mb-2"><i class="mdi mdi-check-circle-outline me-2 text-success"></i>Innovative Technologien einsetzen</li>
                  <li><i class="mdi mdi-check-circle-outline me-2 text-success"></i>Langfristige Kosten-Nutzen-Abwägung</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Logistik E-Learning - HTW Berlin',
  meta: [
    { name: 'description', content: 'Interaktive E-Learning-Plattform für Logistik-Methoden an der HTW Berlin' },
    { name: 'keywords', content: 'Logistik, E-Learning, HTW Berlin, ABC/XYZ-Analyse, Stücklistenanalyse, Make or Buy' }
  ]
})

const features = ref([
  {
    title: 'ABC/XYZ-Analyse',
    description: 'Lernen Sie die ABC/XYZ-Analyse kennen und wenden Sie sie in interaktiven Übungen an.',
    icon: 'mdi mdi-chart-bar',
    link: '/abc-xyz'
  },
  {
    title: 'Stücklistenanalyse',
    description: 'Verstehen Sie die Grundlagen der Stücklistenanalyse und deren Anwendung in der Praxis.',
    icon: 'mdi mdi-format-list-checks',
    link: '/stuecklistenanalyse'
  },
  {
    title: 'Make or Buy',
    description: 'Entscheidungshilfe für die Wahl zwischen Eigenfertigung und Fremdbezug.',
    icon: 'mdi mdi-scale-balance',
    link: '/make-or-buy'
  },
])

const animated = ref(false)
onMounted(() => {
  setTimeout(() => (animated.value = true), 100)
})
</script>
<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative; overflow: hidden;
}
.hero-section::before {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg ... %3E") no-repeat;
  opacity: 0.5; z-index: 0;
}
.hero-section > .container { position: relative; z-index: 1; }
.icon-wrapper {
  width: 80px; height: 80px;
  background-color: rgba(0, 51, 102, 0.1);
  border-radius: 50%; margin: 0 auto;
  display: flex; align-items: center; justify-content: center;
}
.section-title {
  font-weight: 600;
  color: #003366;
}
.card {
  border-radius: 8px;
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.btn-primary {
  padding: 0.5rem 1.5rem; font-weight: 500;
}
.btn-outline-primary:hover {
  background-color: var(--primary-color);
  color: #fff;
}
.animate-fade-in {
  opacity: 0; transform: translateY(20px);
  animation: fadeInUp 0.6s forwards;
}
@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}
.list-unstyled { padding-left: 0; list-style: none; }
.list-unstyled li { margin-bottom: 0.5rem; }
@media (max-width: 768px) {
  .d-flex.flex-wrap { flex-direction: column; }
  .hero-image-container { margin-top: 2rem; }
}
</style>