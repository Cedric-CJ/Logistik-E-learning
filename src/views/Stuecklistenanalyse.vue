<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useHead } from '@vueuse/head';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

useHead({
  title: 'Stücklistenanalyse - Logistik E-Learning',
  meta: [
    { name: 'description', content: 'Erfahren Sie mehr über die Stücklistenanalyse und deren Anwendung in der Produktion.' }
  ]
});

// Product structure data
const productStructure = ref({
  product: 'Fahrrad',
  quantity: 1,
  components: [
    { id: 1, name: 'Rahmen', quantity: 1, level: 1 },
    { id: 2, name: 'Vorderrad', quantity: 1, level: 1 },
    { id: 3, name: 'Hinterrad', quantity: 1, level: 1 },
    { id: 4, name: 'Lenker', quantity: 1, level: 1 },
    { id: 5, name: 'Sattel', quantity: 1, level: 1 },
    { id: 6, name: 'Felge', quantity: 2, level: 2, parent: [2, 3] },
    { id: 7, name: 'Reifen', quantity: 2, level: 2, parent: [2, 3] },
    { id: 8, name: 'Schlauch', quantity: 2, level: 2, parent: [2, 3] },
    { id: 9, name: 'Speiche', quantity: 64, level: 3, parent: [6] },
    { id: 10, name: 'Nabe', quantity: 2, level: 3, parent: [6] }
  ]
});

// Chart data for material requirements
const chartData = ref({
  labels: ['Rahmen', 'Felgen', 'Reifen', 'Schläuche', 'Speichen', 'Naben'],
  datasets: [
    {
      label: 'Benötigte Menge',
      backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'],
      data: [1, 2, 2, 2, 64, 2],
      borderWidth: 0,
      borderRadius: 4
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.parsed.y} Stück`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
});

// Exercise state
const exerciseState = ref({
  showSolution: false,
  userInput: {
    totalFrames: '',
    totalRims: '',
    totalTires: ''
  },
  validation: {
    totalFrames: { isValid: null, message: '' },
    totalRims: { isValid: null, message: '' },
    totalTires: { isValid: null, message: '' }
  },
  isSubmitted: false
});

// Correct answers
const correctAnswers = {
  totalFrames: '50',
  totalRims: '100',
  totalTires: '100'
};

// Check answers
const checkAnswers = () => {
  exerciseState.value.isSubmitted = true;
  let allCorrect = true;
  
  Object.keys(correctAnswers).forEach(key => {
    if (exerciseState.value.userInput[key].trim() === correctAnswers[key]) {
      exerciseState.value.validation[key] = {
        isValid: true,
        message: 'Richtig!'
      };
    } else {
      exerciseState.value.validation[key] = {
        isValid: false,
        message: `Falsch. Versuchen Sie es noch einmal.`
      };
      allCorrect = false;
    }
  });

  return allCorrect;
};

// Reset exercise
const resetExercise = () => {
  exerciseState.value = {
    showSolution: false,
    userInput: { totalFrames: '', totalRims: '', totalTires: '' },
    validation: {
      totalFrames: { isValid: null, message: '' },
      totalRims: { isValid: null, message: '' },
      totalTires: { isValid: null, message: '' }
    },
    isSubmitted: false
  };
};

// Toggle solution
const toggleSolution = () => {
  exerciseState.value.showSolution = !exerciseState.value.showSolution;
};

// Calculate total requirements
const calculateRequirements = (componentId, quantity = 1) => {
  const component = productStructure.value.components.find(c => c.id === componentId);
  if (!component) return 0;
  
  let total = component.quantity * quantity;
  
  // If component has children, calculate their requirements recursively
  const childComponents = productStructure.value.components.filter(c => c.parent?.includes(componentId));
  for (const child of childComponents) {
    total += calculateRequirements(child.id, total);
  }
  
  return total;
};

// Calculate total requirements for all components
const totalRequirements = computed(() => {
  const frames = productStructure.value.components
    .filter(c => c.name === 'Rahmen')
    .reduce((sum, c) => sum + calculateRequirements(c.id, 1), 0);
    
  const rims = productStructure.value.components
    .filter(c => c.name === 'Felge')
    .reduce((sum, c) => sum + calculateRequirements(c.id, 1), 0);
    
  const tires = productStructure.value.components
    .filter(c => c.name === 'Reifen')
    .reduce((sum, c) => sum + calculateRequirements(c.id, 1), 0);
    
  return { frames, rims, tires };
});

// Update chart data when quantity changes
const updateChartData = () => {
  chartData.value.datasets[0].data = [
    totalRequirements.value.frames,
    totalRequirements.value.rims,
    totalRequirements.value.tires,
    totalRequirements.value.tires, // Same as tires (Schläuche)
    calculateRequirements(9, 1), // Speichen
    calculateRequirements(10, 1)  // Naben
  ];
};

// Watch for quantity changes
watch(() => productStructure.value.quantity, () => {
  updateChartData();
});

// Initialize chart data
onMounted(() => {
  updateChartData();
});
</script>

<template>
  <div class="stuecklisten-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-10 mx-auto">
          <h1 class="mb-4 text-center">Stücklistenanalyse</h1>
          
          <!-- Introduction -->
          <div class="card mb-5 border-0 shadow-sm">
            <div class="card-body">
              <h2 class="h4 mb-4">Grundlagen der Stücklistenanalyse</h2>
              <p>
                Die Stücklistenanalyse ist ein zentrales Instrument der Produktionsplanung und -steuerung. 
                Sie beschreibt die mengenmäßige Zusammensetzung eines Erzeugnisses aus seinen Einzelteilen und Baugruppen.
              </p>
              
              <div class="row mt-4">
                <div class="col-md-6">
                  <div class="card h-100 border-0 bg-light">
                    <div class="card-body">
                      <h3 class="h5">Zweck der Stücklistenanalyse</h3>
                      <ul class="mb-0">
                        <li>Ermittlung des Materialbedarfs</li>
                        <li>Durchführung der Bedarfsermittlung</li>
                        <li>Kostenkalkulation</li>
                        <li>Arbeitsplanerstellung</li>
                        <li>Dokumentation der Produktstruktur</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mt-4 mt-md-0">
                  <div class="card h-100 border-0 bg-light">
                    <div class="card-body">
                      <h3 class="h5">Arten von Stücklisten</h3>
                      <ul class="mb-0">
                        <li><strong>Mengenübersichtsstückliste:</strong> Alle Komponenten eines Erzeugnisses</li>
                        <li><strong>Strukturstückliste:</strong> Mit Berücksichtigung der Produktstruktur</li>
                        <li><strong>Baugruppenstückliste:</strong> Nach Baugruppen gegliedert</li>
                        <li><strong>Variantenstückliste:</strong> Für unterschiedliche Produktvarianten</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Product Structure Visualization -->
          <div class="card mb-5 border-0 shadow-sm">
            <div class="card-body">
              <h2 class="h4 mb-4">Produktstruktur und Erzeugnisbaum</h2>
              
              <div class="text-center mb-4">
                <div class="btn-group mb-3" role="group">
                  <button 
                    class="btn btn-outline-primary"
                    @click="productStructure.quantity = Math.max(1, productStructure.quantity - 1)"
                    :disabled="productStructure.quantity <= 1"
                  >
                    -
                  </button>
                  <button class="btn btn-outline-primary" disabled>
                    {{ productStructure.quantity }} {{ productStructure.product }}(er)
                  </button>
                  <button 
                    class="btn btn-outline-primary"
                    @click="productStructure.quantity++"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div class="text-center mb-4">
                <div class="product-structure">
                  <div class="product-node">
                    <div class="node-header">
                      {{ productStructure.product }}
                      <div class="node-quantity">×{{ productStructure.quantity }}</div>
                    </div>
                    <div class="node-children">
                      <div 
                        v-for="component in productStructure.components.filter(c => c.level === 1)" 
                        :key="component.id"
                        class="node-child"
                      >
                        <div class="node-header">
                          {{ component.name }}
                          <div class="node-quantity">×{{ component.quantity * productStructure.quantity }}</div>
                        </div>
                        
                        <div class="node-children">
                          <div 
                            v-for="child in productStructure.components.filter(c => c.parent?.includes(component.id))" 
                            :key="child.id"
                            class="node-child"
                          >
                            <div class="node-header">
                              {{ child.name }}
                              <div class="node-quantity">
                                ×{{ child.quantity * component.quantity * productStructure.quantity }}
                              </div>
                            </div>
                            
                            <div class="node-children">
                              <div 
                                v-for="grandChild in productStructure.components.filter(c => c.parent?.includes(child.id))" 
                                :key="grandChild.id"
                                class="node-child"
                              >
                                <div class="node-header">
                                  {{ grandChild.name }}
                                  <div class="node-quantity">
                                    ×{{ grandChild.quantity * child.quantity * component.quantity * productStructure.quantity }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="chart-container" style="height: 400px;">
                <h3 class="h5 text-center mb-4">Benötigte Materialien für {{ productStructure.quantity }} {{ productStructure.product }}(er)</h3>
                <Bar :data="chartData" :options="chartOptions" />
              </div>
              
              <div class="alert alert-info mt-4">
                <i class="mdi mdi-information-outline me-2"></i>
                Die Grafik zeigt die Gesamtmenge jeder Komponente, die benötigt wird, um 
                {{ productStructure.quantity }} {{ productStructure.product }}(er) herzustellen, 
                unter Berücksichtigung aller Unterkomponenten.
              </div>
            </div>
          </div>
          
          <!-- Interactive Exercise -->
          <div class="card border-0 shadow-sm mb-5">
            <div class="card-body">
              <h2 class="h4 mb-4">Interaktive Übung: Bedarfsermittlung</h2>
              
              <div class="exercise-description mb-4">
                <p>
                  Ein Unternehmen plant die Produktion von 50 Fahrrädern. Berechnen Sie die Gesamtmenge 
                  an benötigten Rahmen, Felgen und Reifen unter Berücksichtigung der Produktstruktur.
                </p>
                <p class="mb-0">
                  <strong>Hinweis:</strong> Beachten Sie die mehrstufige Produktstruktur und die 
                  jeweiligen Mengenverhältnisse.
                </p>
              </div>
              
              <form @submit.prevent="checkAnswers" class="needs-validation" novalidate>
                <div class="row g-3">
                  <div class="col-md-4">
                    <label for="totalFrames" class="form-label">Benötigte Rahmen</label>
                    <div class="input-group">
                      <input 
                        type="number" 
                        class="form-control" 
                        id="totalFrames" 
                        v-model="exerciseState.userInput.totalFrames"
                        :class="{
                          'is-valid': exerciseState.validation.totalFrames.isValid === true,
                          'is-invalid': exerciseState.validation.totalFrames.isValid === false
                        }"
                        required
                        :disabled="exerciseState.showSolution"
                      >
                      <span class="input-group-text">Stück</span>
                    </div>
                    <div class="valid-feedback">
                      {{ exerciseState.validation.totalFrames.isValid ? exerciseState.validation.totalFrames.message : '' }}
                    </div>
                    <div class="invalid-feedback">
                      {{ exerciseState.validation.totalFrames.message }}
                    </div>
                  </div>
                  
                  <div class="col-md-4">
                    <label for="totalRims" class="form-label">Benötigte Felgen</label>
                    <div class="input-group">
                      <input 
                        type="number" 
                        class="form-control" 
                        id="totalRims" 
                        v-model="exerciseState.userInput.totalRims"
                        :class="{
                          'is-valid': exerciseState.validation.totalRims.isValid === true,
                          'is-invalid': exerciseState.validation.totalRims.isValid === false
                        }"
                        required
                        :disabled="exerciseState.showSolution"
                      >
                      <span class="input-group-text">Stück</span>
                    </div>
                    <div class="valid-feedback">
                      {{ exerciseState.validation.totalRims.isValid ? exerciseState.validation.totalRims.message : '' }}
                    </div>
                    <div class="invalid-feedback">
                      {{ exerciseState.validation.totalRims.message }}
                    </div>
                  </div>
                  
                  <div class="col-md-4">
                    <label for="totalTires" class="form-label">Benötigte Reifen</label>
                    <div class="input-group">
                      <input 
                        type="number" 
                        class="form-control" 
                        id="totalTires" 
                        v-model="exerciseState.userInput.totalTires"
                        :class="{
                          'is-valid': exerciseState.validation.totalTires.isValid === true,
                          'is-invalid': exerciseState.validation.totalTires.isValid === false
                        }"
                        required
                        :disabled="exerciseState.showSolution"
                      >
                      <span class="input-group-text">Stück</span>
                    </div>
                    <div class="valid-feedback">
                      {{ exerciseState.validation.totalTires.isValid ? exerciseState.validation.totalTires.message : '' }}
                    </div>
                    <div class="invalid-feedback">
                      {{ exerciseState.validation.totalTires.message }}
                    </div>
                  </div>
                </div>
                
                <div class="mt-4 d-flex gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="exerciseState.showSolution"
                  >
                    Überprüfen
                  </button>
                  
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="resetExercise"
                    v-if="exerciseState.isSubmitted"
                  >
                    Neu versuchen
                  </button>
                  
                  <button 
                    type="button" 
                    class="btn btn-outline-primary ms-auto"
                    @click="toggleSolution"
                  >
                    {{ exerciseState.showSolution ? 'Lösung ausblenden' : 'Lösung anzeigen' }}
                  </button>
                </div>
              </form>
              
              <!-- Solution -->
              <div v-if="exerciseState.showSolution" class="mt-4 p-3 bg-light rounded">
                <h3 class="h5">Lösung:</h3>
                <p>Für die Produktion von 50 Fahrrädern werden benötigt:</p>
                <ul>
                  <li><strong>Rahmen:</strong> 50 Stück (1 × 50)</li>
                  <li><strong>Felgen:</strong> 100 Stück (2 × 50, da jedes Fahrrad 2 Räder hat)</li>
                  <li><strong>Reifen:</strong> 100 Stück (2 × 50, da jedes Fahrrad 2 Reifen hat)</li>
                </ul>
                <p class="mb-0">
                  <strong>Hinweis:</strong> Die Berechnung erfolgt durch Multiplikation der Stückzahl pro Fahrrad 
                  mit der Anzahl der Fahrräder. Bei mehrstufigen Stücklisten müssten zusätzlich die 
                  Mengen der Unterkomponenten berücksichtigt werden.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Practical Application -->
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h2 class="h4 mb-4">Praktische Anwendung in der Materialwirtschaft</h2>
              
              <p>
                Die Stücklistenanalyse bildet die Grundlage für verschiedene betriebswirtschaftliche Prozesse:
              </p>
              
              <div class="row mt-4">
                <div class="col-md-6">
                  <div class="card h-100 border-0 bg-light">
                    <div class="card-body">
                      <h3 class="h5">Materialbedarfsplanung (MRP)</h3>
                      <p>
                        Durch die mehrstufige Auflösung der Stücklisten kann der genaue Materialbedarf 
                        für die Produktion ermittelt werden. Dies ist entscheidend für:
                      </p>
                      <ul class="mb-0">
                        <li>Bestellmengenplanung</li>
                        <li>Lagerbestandsführung</li>
                        <li>Lieferterminplanung</li>
                        <li>Kapazitätsplanung</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6 mt-4 mt-md-0">
                  <div class="card h-100 border-0 bg-light">
                    <div class="card-body">
                      <h3 class="h5">Kostenrechnung</h3>
                      <p>
                        Stücklisten bilden die Basis für die Kalkulation der Herstellkosten:
                      </p>
                      <ul class="mb-0">
                        <li>Ermittlung der Einzelkosten</li>
                        <li>Kostenstellenrechnung</li>
                        <li>Preiskalkulation</li>
                        <li>Deckungsbeitragsrechnung</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="alert alert-warning mt-4">
                <i class="mdi mdi-alert-outline me-2"></i>
                <strong>Wichtig:</strong> Für eine effiziente Materialwirtschaft ist die Pflege 
                aktueller und korrekter Stücklisten unerlässlich. Änderungen an der Produktstruktur 
                müssen zeitnah in den Stücklisten berücksichtigt werden.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stuecklisten-page {
  background-color: #f8f9fa;
  min-height: 100%;
  padding-bottom: 2rem;
}

.card {
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.product-structure {
  text-align: center;
  font-size: 0.9rem;
}

.product-node {
  display: inline-block;
  margin: 10px;
  vertical-align: top;
}

.node-header {
  background-color: #3498db;
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
  font-weight: 500;
  min-width: 120px;
  position: relative;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.node-quantity {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  font-weight: bold;
  box-shadow: 0 2px 3px rgba(0,0,0,0.2);
}

.node-children {
  display: flex;
  justify-content: center;
  padding-top: 25px;
  position: relative;
}

.node-children::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  border-left: 2px solid #95a5a6;
  height: 20px;
  transform: translateX(-50%);
}

.node-child {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  position: relative;
  padding-top: 25px;
}

.node-child::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  border-top: 2px solid #95a5a6;
  width: 100%;
  transform: translateX(-50%);
}

.node-child::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  border-left: 2px solid #95a5a6;
  height: 20px;
  transform: translateX(-50%);
}

.node-child:first-child::before {
  left: 50%;
  width: 50%;
}

.node-child:last-child::before {
  right: 50%;
  width: 50%;
  left: auto;
}

.node-child:only-child::before {
  display: none;
}

.chart-container {
  position: relative;
  margin: 0 auto;
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.alert {
  border-left: 4px solid;
  border-radius: 0.25rem;
}

.alert-info {
  border-left-color: #17a2b8;
}

.alert-warning {
  border-left-color: #ffc107;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-structure {
    font-size: 0.8rem;
    overflow-x: auto;
    padding: 10px 0;
  }
  
  .node-header {
    min-width: 100px;
    padding: 5px 10px;
    font-size: 0.9em;
  }
  
  .node-quantity {
    width: 20px;
    height: 20px;
    font-size: 0.7em;
  }
  
  .chart-container {
    height: 300px !important;
    padding: 10px;
  }
}
</style>
