<template>
  <div v-if="show" class="overlay-backdrop" @click.self="close">
    <div class="overlay-content" :style="position">
      <div class="card shadow-lg">
        <div class="card-body">
          <h5 class="card-title">{{ title }}</h5>
          <p class="card-text">{{ text }}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-muted">{{ currentStep + 1 }} / {{ totalSteps }}</span>
            <div>
              <button v-if="currentStep > 0" @click="prev" class="btn btn-outline-secondary btn-sm me-2">Zurück</button>
              <button v-if="currentStep < totalSteps - 1" @click="next" class="btn btn-primary btn-sm">Weiter</button>
              <button v-if="currentStep === totalSteps - 1" @click="close" class="btn btn-success btn-sm">Fertig</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  steps: Array,
  currentStep: Number
});

const emit = defineEmits(['update:show', 'update:currentStep']);

const title = computed(() => props.steps[props.currentStep]?.title || '');
const text = computed(() => props.steps[props.currentStep]?.text || '');
const totalSteps = computed(() => props.steps.length);

const position = computed(() => {
  const step = props.steps[props.currentStep];
  // Fallback to center if no element is specified for the step
  if (!step || !step.element) {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  const element = document.querySelector(step.element);
  // Fallback to center if the element is not found in the DOM
  if (!element) {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  // Highlight the element and scroll it into view
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const rect = element.getBoundingClientRect();
  const overlayWidth = 350; // As defined in max-width of .overlay-content
  const overlayHeight = 200; // Geschätzte Höhe des Overlays
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // Calculate left position to center the overlay horizontally relative to the element
  let left = rect.left + (rect.width / 2) - (overlayWidth / 2);
  
  // Adjust position to ensure overlay is fully visible
  if (left < 10) left = 10;
  if (left + overlayWidth > viewportWidth - 10) {
    left = viewportWidth - overlayWidth - 10;
  }
  
  // Calculate top position with dynamic offset
  const headerHeight = 70; // Approximate header height
  const minSpaceBelow = 20; // Minimum space below the element
  const elementPadding = 15; // Additional padding around the element
  
  // Calculate available space below the element
  const spaceBelow = viewportHeight - rect.bottom - minSpaceBelow;
  const spaceNeeded = 200; // Approximate height needed for the overlay
  
  // Always position the overlay below the element if possible
  let top = rect.bottom + elementPadding;
  
  // If there's not enough space below, position above the element
  if (spaceBelow < spaceNeeded && rect.top > spaceNeeded) {
    top = rect.top - spaceNeeded - elementPadding;
  } else if (spaceBelow < spaceNeeded) {
    // If there's not enough space above either, position at the bottom of the viewport
    top = viewportHeight - spaceNeeded - minSpaceBelow;
  }
  
  // Ensure the overlay is at least below the header
  top = Math.max(top, headerHeight + 10);
  
  // Ensure the overlay is positioned relative to the viewport, not the document
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  top += scrollTop;
  left += scrollLeft;

  return {
    top: `${top}px`,
    left: `${left}px`,
    position: 'absolute',
    'z-index': '1050' // Höher als das Highlight, um Überlappungen zu vermeiden
  };
});

watch(() => props.currentStep, (newStep, oldStep) => {
  if (oldStep !== undefined) {
    const oldElement = document.querySelector(props.steps[oldStep]?.element);
    if (oldElement) oldElement.classList.remove('highlight');
  }
  const newElement = document.querySelector(props.steps[newStep]?.element);
  if (newElement) newElement.classList.add('highlight');
});

const next = () => {
  if (props.currentStep < totalSteps.value - 1) {
    emit('update:currentStep', props.currentStep + 1);
  }
};

const prev = () => {
  if (props.currentStep > 0) {
    emit('update:currentStep', props.currentStep - 1);
  }
};

const close = () => {
  const oldElement = document.querySelector(props.steps[props.currentStep]?.element);
  if (oldElement) oldElement.classList.remove('highlight');
  emit('update:show', false);
};

</script>

<style scoped>
.overlay-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000; /* Lower than header */
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 60px; /* Make space for the header */
}

.overlay-content {
  position: fixed; /* Changed from absolute to fixed */
  background: transparent;
  border-radius: 8px;
  max-width: 350px;
  max-height: 60vh;
  overflow-y: auto;
  width: 100%;
  transition: all 0.3s ease;
}

.card {
  border: none;
  background-color: white !important;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 12px;
}

.card-text {
  color: #555;
  margin-bottom: 16px;
}

:global(.highlight) {
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.3); /* Lighter shadow */
  background-color: rgba(0, 123, 255, 0.1); /* Slightly lighter background */
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
  position: relative;
  z-index: 999; /* Lower than overlay but still visible */
  max-height: calc(100vh - 180px) !important;
  overflow: auto !important;
  margin: 4px 0;
  padding: 4px 8px;
}

/* Ensure header stays on top of overlay */
:global(.navbar) {
  position: relative;
  z-index: 1100 !important;
  background-color: var(--bs-primary) !important;
}

/* Overlay content positioning */
.overlay-content {
  z-index: 1001 !important;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.card {
  z-index: 1002 !important;
  margin: 10px;
}

/* Ensure footer stays on top of overlay */
:global(footer) {
  position: relative;
  z-index: 1100 !important;
}
</style>
