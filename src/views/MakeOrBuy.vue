<template>
  <div class="make-or-buy">
    <div class="container py-4">
      <h1 class="mb-4">Make-or-Buy Entscheidung</h1>
      
      <!-- Einführung -->
      <section class="mb-5">
        <h2 class="h4 mb-3">Einführung</h2>
        <div class="card">
          <div class="card-body">
            <p>Die Make-or-Buy Entscheidung ist eine strategische Entscheidung, ob ein Unternehmen eine bestimmte Leistung selbst erstellen (Make) oder von einem externen Anbieter beziehen soll (Buy). Diese Entscheidung hat erhebliche Auswirkungen auf die Wettbewerbsfähigkeit eines Unternehmens.</p>
            
            <div class="alert alert-info mt-3">
              <h5 class="alert-heading">Wichtige Faktoren</h5>
              <ul class="mb-0">
                <li>Kostenvergleich</li>
                <li>Qualitative Aspekte</li>
                <li>Strategische Bedeutung</li>
                <li>Risikobewertung</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Kostenvergleich -->
      <section class="mb-5">
        <h2 class="h4 mb-3">Kostenvergleich</h2>
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h5>Make-Kosten</h5>
                <div class="mb-3">
                  <label for="fixeKosten" class="form-label">Fixe Kosten (€/Jahr)</label>
                  <input type="number" class="form-control" id="fixeKosten" v-model="fixeKosten" @input="updateChart">
                </div>
                <div class="mb-3">
                  <label for="variableKosten" class="form-label">Variable Kosten (€/Stück)</label>
                  <input type="number" step="0.01" class="form-control" id="variableKosten" v-model="variableKosten" @input="updateChart">
                </div>
              </div>
              <div class="col-md-6">
                <h5>Buy-Kosten</h5>
                <div class="mb-3">
                  <label for="kaufpreis" class="form-label">Einkaufspreis (€/Stück)</label>
                  <input type="number" step="0.01" class="form-control" id="kaufpreis" v-model="kaufpreis" @input="updateChart">
                </div>
                <div class="mb-3">
                  <label for="bestellkosten" class="form-label">Bestellkosten (€/Bestellung)</label>
                  <input type="number" class="form-control" id="bestellkosten" v-model="bestellkosten" @input="updateChart">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <label for="menge" class="form-label">Menge (Stück/Jahr)</label>
                <input type="range" class="form-range" id="menge" min="0" :max="maxMenge" v-model="menge" @input="updateChart">
                <div class="d-flex justify-content-between">
                  <span>0</span>
                  <span>{{ menge }} Stück/Jahr</span>
                  <span>{{ maxMenge }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Diagramm -->
        <div class="card">
          <div class="card-body">
            <div class="chart-container" style="position: relative; height: 300px;">
              <canvas ref="chart"></canvas>
            </div>
            <div class="mt-3" v-if="breakEvenPoint > 0">
              <p class="mb-0">Break-Even-Punkt: {{ breakEvenPoint.toFixed(0) }} Stück/Jahr</p>
              <p class="mb-0">Empfehlung: <strong>{{ empfehlung }}</strong></p>
            </div>
          </div>
        </div>
      </section>

      <!-- Qualitative Faktoren -->
      <section class="mb-5">
        <h2 class="h4 mb-3">Qualitative Faktoren</h2>
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-header bg-primary text-white">Vorteile Make</div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Bessere Qualitätskontrolle</li>
                <li class="list-group-item">Schutz von Know-how</li>
                <li class="list-group-item">Geringere Abhängigkeit</li>
                <li class="list-group-item">Bessere Termintreue</li>
              </ul>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-header bg-success text-white">Vorteile Buy</div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Kostenvorteile durch Spezialisierung</li>
                <li class="list-group-item">Geringere Investitionen</li>
                <li class="list-group-item">Höhere Flexibilität</li>
                <li class="list-group-item">Zugang zu neuester Technologie</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Interaktive Übung -->
      <section class="mb-5">
        <h2 class="h4 mb-3">Übung: Make-or-Buy Entscheidung</h2>
        <div class="card">
          <div class="card-body">
            <p>Ein Unternehmen steht vor der Entscheidung, ob es ein Bauteil selbst herstellen oder zukaufen soll. Folgende Daten liegen vor:</p>
            
            <div class="table-responsive mb-4">
              <table class="table table-bordered">
                <thead class="table-light">
                  <tr>
                    <th>Kostenart</th>
                    <th>Make</th>
                    <th>Buy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fixe Kosten pro Jahr</td>
                    <td>50.000 €</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Variable Kosten pro Stück</td>
                    <td>45 €</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Einkaufspreis pro Stück</td>
                    <td>-</td>
                    <td>80 €</td>
                  </tr>
                  <tr>
                    <td>Jahresbedarf</td>
                    <td colspan="2">2.000 Stück</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mb-3">
              <label for="ubungMenge" class="form-label">Ab welcher Stückzahl lohnt sich die Eigenfertigung?</label>
              <input 
                type="number" 
                class="form-control" 
                id="ubungMenge" 
                v-model="ubungAntwort" 
                :class="{ 'is-valid': ubungRichtig, 'is-invalid': ubungFalsch }"
              >
              <div class="valid-feedback">Richtig! Die Eigenfertigung lohnt sich ab 1.429 Stück.</div>
              <div class="invalid-feedback">Leider falsch. Überprüfen Sie Ihre Berechnung noch einmal.</div>
            </div>
            
            <button class="btn btn-primary me-2" @click="pruefeUebung">Prüfen</button>
            <button class="btn btn-outline-secondary" @click="zeigeLoesung">Lösung anzeigen</button>
            
            <div class="mt-3" v-if="loesungGezeigt">
              <h5>Lösungsweg:</h5>
              <p>Berechnung des Break-Even-Punktes:</p>
              <p>Fixkosten / (Kaufpreis - variable Kosten) = 50.000 € / (80 € - 45 €) = 1.428,57 Stück</p>
              <p>Abgerundet auf volle Stück: 1.429 Stück</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Zusammenfassung -->
      <section>
        <h2 class="h4 mb-3">Zusammenfassung</h2>
        <div class="card">
          <div class="card-body">
            <p>Die Make-or-Buy Entscheidung sollte sowohl quantitative als auch qualitative Faktoren berücksichtigen. Während die Kostenanalyse einen ersten Anhaltspunkt bietet, können strategische Überlegungen die Entscheidung maßgeblich beeinflussen.</p>
            <p>Wichtige Schritte im Entscheidungsprozess:</p>
            <ol>
              <li>Kostenvergleich durchführen</li>
              <li>Qualitative Faktoren bewerten</li>
              <li>Risiken analysieren</li>
              <li>Strategische Bedeutung prüfen</li>
              <li>Entscheidung treffen und umsetzen</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

export default {
  name: 'MakeOrBuy',
  setup() {
    // Chart Referenz
    const chart = ref(null);
    let myChart = null;
    
    // Formular-Daten
    const fixeKosten = ref(50000);
    const variableKosten = ref(45);
    const kaufpreis = ref(80);
    const bestellkosten = ref(0);
    const menge = ref(2000);
    const maxMenge = ref(5000);
    const breakEvenPoint = ref(0);
    const empfehlung = ref('');
    
    // Übungsdaten
    const ubungAntwort = ref('');
    const ubungRichtig = ref(false);
    const ubungFalsch = ref(false);
    const loesungGezeigt = ref(false);

    // Berechne Break-Even-Punkt
    const berechneBreakEven = () => {
      const differenz = kaufpreis.value - variableKosten.value;
      if (differenz > 0) {
        breakEvenPoint.value = fixeKosten.value / differenz;
      } else {
        breakEvenPoint.value = 0;
      }
      
      // Empfehlung aktualisieren
      if (menge.value < breakEvenPoint.value) {
        empfehlung.value = 'Buy (Zukauf)';
      } else {
        empfehlung.value = 'Make (Eigenfertigung)';
      }
      
      return breakEvenPoint.value;
    };

    // Diagramm aktualisieren
    const updateChart = () => {
      berechneBreakEven();
      
      if (!myChart) return;
      
      const labels = [];
      const makeData = [];
      const buyData = [];
      
      // Daten für das Diagramm generieren
      for (let i = 0; i <= maxMenge.value; i += maxMenge.value / 10) {
        labels.push(i.toFixed(0));
        makeData.push(fixeKosten.value + variableKosten.value * i);
        buyData.push(kaufpreis.value * i + bestellkosten.value);
      }
      
      myChart.data.labels = labels;
      myChart.data.datasets[0].data = makeData;
      myChart.data.datasets[1].data = buyData;
      myChart.update();
    };
    
    // Übung prüfen
    const pruefeUebung = () => {
      const korrekteAntwort = 1429; // 50000 / (80-45) = 1428,57 -> aufgerundet 1429
      const antwort = parseInt(ubungAntwort.value);
      
      if (isNaN(antwort)) {
        ubungFalsch.value = true;
        return;
      }
      
      if (Math.abs(antwort - korrekteAntwort) <= 1) {
        ubungRichtig.value = true;
        ubungFalsch.value = false;
      } else {
        ubungRichtig.value = false;
        ubungFalsch.value = true;
      }
    };
    
    // Lösung anzeigen
    const zeigeLoesung = () => {
      loesungGezeigt.value = true;
      ubungAntwort.value = '1429';
      ubungRichtig.value = true;
      ubungFalsch.value = false;
    };

    // Lifecycle Hooks
    onMounted(() => {
      // Chart.js registrieren
      Chart.register(...registerables);
      
      // Diagramm initialisieren
      const ctx = chart.value.getContext('2d');
      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Make (Eigenfertigung)',
              data: [],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false
            },
            {
              label: 'Buy (Zukauf)',
              data: [],
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Menge (Stück/Jahr)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Kosten (€)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                  }
                  return label;
                }
              }
            },
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Kostenvergleich Make-or-Buy'
            }
          }
        }
      });
      
      // Initiales Update des Diagramms
      updateChart();
    });

    onBeforeUnmount(() => {
      // Aufräumen
      if (myChart) {
        myChart.destroy();
      }
    });

    return {
      chart,
      fixeKosten,
      variableKosten,
      kaufpreis,
      bestellkosten,
      menge,
      maxMenge,
      breakEvenPoint,
      empfehlung,
      ubungAntwort,
      ubungRichtig,
      ubungFalsch,
      loesungGezeigt,
      updateChart,
      pruefeUebung,
      zeigeLoesung
    };
  }
};
</script>

<style scoped>
.make-or-buy {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: 600;
  border-radius: 10px 10px 0 0 !important;
}

.form-range::-webkit-slider-thumb {
  background: #0d6efd;
}

.form-range::-moz-range-thumb {
  background: #0d6efd;
}

.form-range::-ms-thumb {
  background: #0d6efd;
}

.btn-primary {
  background-color: #0d6efd;
  border: none;
  padding: 8px 20px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-outline-secondary {
  padding: 8px 20px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.alert {
  border-radius: 10px;
  border: none;
}

.table {
  border-radius: 10px;
  overflow: hidden;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* Responsive Anpassungen */
@media (max-width: 768px) {
  .chart-container {
    height: 250px !important;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .btn:last-child {
    margin-bottom: 0;
  }
}
</style>
