// ==========================================
// DATA MANAGEMENT & LOCALSTORAGE
// ==========================================

const DataManager = {
save(key, value) {
localStorage.setItem(key, JSON.stringify(value));
},

```
load(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
},

saveAll() {
    // Save all form values
    const forms = ['revenu-mensuel', 'depenses-mensuelles', 'capital-actuel'];
    forms.forEach(id => {
        const el = document.getElementById(id);
        if (el) this.save(id, el.value);
    });
},

loadAll() {
    // Load all form values
    const forms = ['revenu-mensuel', 'depenses-mensuelles', 'capital-actuel'];
    forms.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const value = this.load(id);
            if (value !== null) el.value = value;
        }
    });
}
```

};

// ==========================================
// NAVIGATION
// ==========================================

function initNavigation() {
// Mobile menu toggle
const mobileMenuBtn = document.getElementById(‘mobileMenuBtn’);
const sidebar = document.getElementById(‘sidebar’);

```
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
}

// Section navigation
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        // Close mobile menu
        sidebar.classList.remove('open');
        
        // Remove active class from all items and sections
        navItems.forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Show corresponding section
        const sectionId = this.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            // Scroll to top
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    });
});
```

}

// ==========================================
// SLIDERS UPDATE
// ==========================================

function updateSlider(sliderId, valueId, suffix = ‘’) {
const slider = document.getElementById(sliderId);
const valueSpan = document.getElementById(valueId);

```
if (slider && valueSpan) {
    slider.addEventListener('input', function() {
        valueSpan.textContent = this.value + suffix;
    });
}
```

}

// Initialize sliders
function initSliders() {
updateSlider(‘epargne-slider’, ‘epargne-value’, ‘€’);
updateSlider(‘rendement-slider’, ‘rendement-value’, ‘%’);
updateSlider(‘duree-slider’, ‘duree-value’, ’ ans’);
updateSlider(‘reseau-slider’, ‘reseau-value’);
updateSlider(‘reputation-slider’, ‘reputation-value’);
updateSlider(‘competences-slider’, ‘competences-value’);
updateSlider(‘heures-semaine’, ‘heures-value’, ‘h’);
updateSlider(‘coef-nego’, ‘coef-value’);
updateSlider(‘budget-alim’, ‘budget-alim-value’, ‘€’);
updateSlider(‘repas-ru’, ‘repas-ru-value’);

```
// Attractivity sliders
updateSlider('symetrie', 'symetrie-value');
updateSlider('rapport-epaules', 'epaules-value');
updateSlider('statut', 'statut-value');
updateSlider('humour', 'humour-value');
updateSlider('stabilite', 'stabilite-value');
updateSlider('nervosite', 'nervosite-value');
updateSlider('odeur', 'odeur-value');
updateSlider('voix', 'voix-value');
```

}

// ==========================================
// MATH FORMULAS (KaTeX)
// ==========================================

function renderFormulas() {
const formulas = {
‘formula-iplf’: String.raw`\text{IPLF}_t = \min\left(100, \frac{W_t}{W^*} \times 100\right) \quad \text{où} \quad W^* = \frac{12 \times D_t}{0.035}`,
‘formula-compound’: String.raw`W(t) = W_0 \cdot (1+r)^t + E_{\text{annuel}} \cdot \frac{(1+r)^t - 1}{r}`,
‘formula-ses’: String.raw`\text{SES}_t = 0.20 \cdot \frac{R_t}{2200} + 0.30 \cdot \frac{\mathcal{S}_t}{50} + 0.20 \cdot \frac{\mathcal{R}_t}{100} + 0.30 \cdot \mathcal{C}_t`,
‘formula-calories’: String.raw`\text{BMR} = 10 \times P + 6.25 \times T - 5 \times A + 5`,
‘formula-attractivity’: String.raw`A = \alpha \cdot \mathcal{S} + \beta \cdot \mathcal{M} + \gamma \cdot \frac{\text{Statut} + \text{Humour} + \text{Perso}}{\text{Nervosité} + 1} + \delta \cdot \text{Odeur} + \epsilon \cdot \text{Voix}`,
‘formula-salary’: String.raw`\text{Salaire final} = \text{Ancre} + \delta \cdot (\text{Valeur perçue} - \text{Ancre})`,
‘formula-reputation’: String.raw`\mathcal{R}_t = \frac{\text{Interactions positives}}{\text{Total interactions} + 1} \times 100`
};

```
Object.entries(formulas).forEach(([id, formula]) => {
    const el = document.getElementById(id);
    if (el) {
        katex.render(formula, el, {
            throwOnError: false,
            displayMode: true
        });
    }
});
```

}

// ==========================================
// CALCULATORS
// ==========================================

function calculateIPLF() {
const revenu = parseFloat(document.getElementById(‘revenu-mensuel’).value) || 0;
const depenses = parseFloat(document.getElementById(‘depenses-mensuelles’).value) || 0;
const capital = parseFloat(document.getElementById(‘capital-actuel’).value) || 0;

```
const epargne = revenu - depenses;
const capitalCible = (12 * depenses) / 0.035;
const iplf = Math.min(100, (capital / capitalCible) * 100);

let tempsRestant = 0;
if (epargne > 0 && capital < capitalCible) {
    const r = 0.07; // 7% rendement
    tempsRestant = Math.log(1 + ((capitalCible - capital) * r) / (12 * epargne)) / Math.log(1 + r);
} else if (epargne <= 0) {
    tempsRestant = Infinity;
}

// Display results
document.getElementById('result-epargne').textContent = epargne.toFixed(0) + '€';
document.getElementById('result-capital-cible').textContent = capitalCible.toFixed(0) + '€';
document.getElementById('result-iplf').textContent = iplf.toFixed(2) + '%';
document.getElementById('result-temps').textContent = isFinite(tempsRestant) ? tempsRestant.toFixed(1) + ' ans' : '∞';

document.getElementById('iplf-results').style.display = 'block';

// Update dashboard
updateDashboard('iplf', iplf);

// Save to localStorage
DataManager.save('iplf-data', {revenu, depenses, capital, epargne, capitalCible, iplf, tempsRestant});
```

}

function calculateInvestment() {
const capitalInitial = parseFloat(document.getElementById(‘capital-initial’).value) || 0;
const epargneMensuelle = parseFloat(document.getElementById(‘epargne-slider’).value) || 0;
const rendement = parseFloat(document.getElementById(‘rendement-slider’).value) / 100 || 0;
const duree = parseInt(document.getElementById(‘duree-slider’).value) || 0;

```
const epargneAnnuelle = epargneMensuelle * 12;

// Generate data points
const years = [];
const values = [];

for (let t = 0; t <= duree; t++) {
    const capital = capitalInitial * Math.pow(1 + rendement, t) + 
                   epargneAnnuelle * (Math.pow(1 + rendement, t) - 1) / rendement;
    years.push(t);
    values.push(Math.round(capital));
}

// Create or update chart
const ctx = document.getElementById('investmentChart');
if (window.investmentChart) {
    window.investmentChart.destroy();
}

window.investmentChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: years,
        datasets: [{
            label: 'Capital (€)',
            data: values,
            borderColor: 'rgba(0, 217, 255, 1)',
            backgroundColor: 'rgba(0, 217, 255, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: '#e5e7eb',
                    font: {
                        family: "'JetBrains Mono', monospace"
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Années',
                    color: '#9ca3af',
                    font: {
                        family: "'Orbitron', sans-serif"
                    }
                },
                ticks: {
                    color: '#9ca3af'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Capital (€)',
                    color: '#9ca3af',
                    font: {
                        family: "'Orbitron', sans-serif"
                    }
                },
                ticks: {
                    color: '#9ca3af',
                    callback: function(value) {
                        return value.toLocaleString() + '€';
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        }
    }
});
```

}

function calculateSES() {
const revenu = parseFloat(document.getElementById(‘ses-revenu’).value) || 0;
const reseau = parseFloat(document.getElementById(‘reseau-slider’).value) || 0;
const reputation = parseFloat(document.getElementById(‘reputation-slider’).value) || 0;
const competences = parseFloat(document.getElementById(‘competences-slider’).value) || 0;

```
const ses = 0.20 * (revenu / 2200) + 
           0.30 * (reseau / 50) + 
           0.20 * (reputation / 100) + 
           0.30 * competences;

document.getElementById('result-ses').textContent = ses.toFixed(2);
document.getElementById('ses-results').style.display = 'block';

// Update dashboard
updateDashboard('ses', ses * 100);
```

}

function calculateCalories() {
const poids = parseFloat(document.getElementById(‘poids’).value) || 0;
const taille = parseFloat(document.getElementById(‘taille’).value) || 0;
const age = parseFloat(document.getElementById(‘age’).value) || 0;
const activite = parseFloat(document.getElementById(‘activite’).value) || 1.2;

```
// Mifflin-St Jeor Formula
const bmr = 10 * poids + 6.25 * taille - 5 * age + 5;
const tdee = Math.round(bmr * activite);

// Macronutrients
const proteines = Math.round(tdee * 0.20);
const proteinesG = Math.round(proteines / 4);
const lipides = Math.round(tdee * 0.27);
const lipidesG = Math.round(lipides / 9);
const glucides = Math.round(tdee * 0.53);
const glucidesG = Math.round(glucides / 4);

document.getElementById('result-bmr').textContent = Math.round(bmr) + ' kcal';
document.getElementById('result-tdee').textContent = tdee + ' kcal';

document.getElementById('proteines').textContent = proteines;
document.getElementById('proteines-g').textContent = proteinesG;
document.getElementById('lipides').textContent = lipides;
document.getElementById('lipides-g').textContent = lipidesG;
document.getElementById('glucides').textContent = glucides;
document.getElementById('glucides-g').textContent = glucidesG;

document.getElementById('calories-results').style.display = 'block';

// Update dashboard
updateDashboard('health', 75); // Default health score
```

}

function calculateAttractivity() {
const symetrie = parseFloat(document.getElementById(‘symetrie’).value) || 0;
const rapportEpaules = parseFloat(document.getElementById(‘rapport-epaules’).value) || 1;
const statut = parseFloat(document.getElementById(‘statut’).value) || 0;
const humour = parseFloat(document.getElementById(‘humour’).value) || 0;
const stabilite = parseFloat(document.getElementById(‘stabilite’).value) || 0;
const nervosite = parseFloat(document.getElementById(‘nervosite’).value) || 0;
const odeur = parseFloat(document.getElementById(‘odeur’).value) || 0;
const voix = parseFloat(document.getElementById(‘voix’).value) || 0;

```
// Normalize rapport épaules/taille (1.0-1.6 -> 0-1)
const masculinite = Math.min(1, Math.max(0, (rapportEpaules - 1.0) / 0.6));

// Calculate attractivity score
const alpha = 0.25; // Symétrie
const beta = 0.25;  // Masculinité
const gamma = 0.25; // Comportement
const delta = 0.125; // Odeur
const epsilon = 0.125; // Voix

const comportement = (statut/10 + humour/10 + stabilite/10) / 3;
const comportementAjuste = comportement / (1 + nervosite/10);

const score = alpha * symetrie + 
             beta * masculinite + 
             gamma * comportementAjuste + 
             delta * odeur + 
             epsilon * voix;

// Display score
const scorePercent = score * 100;
document.getElementById('score-number').textContent = score.toFixed(2);

// Update circle progress
const circle = document.getElementById('score-circle');
const circumference = 534;
const offset = circumference - (scorePercent / 100) * circumference;
circle.style.strokeDashoffset = offset;

// Interpretation
let interpretation, description;
if (score >= 0.85) {
    interpretation = "Exceptionnel (Top 5%)";
    description = "Vous possédez un niveau d'attractivité exceptionnel. Continuez à cultiver vos atouts.";
} else if (score >= 0.75) {
    interpretation = "Excellent (Top 15%)";
    description = "Très bon niveau d'attractivité. Quelques optimisations mineures possibles.";
} else if (score >= 0.65) {
    interpretation = "Très Bon (Top 30%)";
    description = "Bon niveau d'attractivité avec un potentiel d'amélioration significatif.";
} else if (score >= 0.55) {
    interpretation = "Bon (Top 50%)";
    description = "Niveau correct. Concentrez-vous sur les axes d'amélioration prioritaires.";
} else if (score >= 0.45) {
    interpretation = "Moyen (Top 70%)";
    description = "Potentiel d'amélioration important. Suivez le plan d'optimisation.";
} else {
    interpretation = "À Optimiser";
    description = "Fort potentiel d'amélioration. Investissez dans votre développement personnel.";
}

document.getElementById('score-interpretation').textContent = interpretation;
document.getElementById('score-description').textContent = description;

// Breakdown
const breakdown = [
    `Symétrie : ${(symetrie * 100).toFixed(0)}% (poids : 25%)`,
    `Masculinité (ratio É/T = ${rapportEpaules.toFixed(2)}) : ${(masculinite * 100).toFixed(0)}% (poids : 25%)`,
    `Comportement (statut ${statut}, humour ${humour}, stabilité ${stabilite}) : ${(comportementAjuste * 100).toFixed(0)}% (poids : 25%)`,
    `Nervosité : ${nervosite}/10 (facteur réducteur)`,
    `Odeur : ${(odeur * 100).toFixed(0)}% (poids : 12.5%)`,
    `Voix : ${(voix * 100).toFixed(0)}% (poids : 12.5%)`
];

const breakdownList = document.getElementById('score-breakdown');
breakdownList.innerHTML = breakdown.map(item => `<li>${item}</li>`).join('');

document.getElementById('attractivity-results').style.display = 'block';

// Update dashboard
updateDashboard('attractivity', scorePercent);
```

}

function calculateSalary() {
const offre = parseFloat(document.getElementById(‘offre-initiale’).value) || 0;
const valeur = parseFloat(document.getElementById(‘valeur-percue’).value) || 0;
const coef = parseFloat(document.getElementById(‘coef-nego’).value) || 0.4;

```
const salaireFinal = offre + coef * (valeur - offre);
const gain = salaireFinal - offre;

document.getElementById('result-salary').textContent = Math.round(salaireFinal).toLocaleString() + '€';
document.getElementById('gain-salary').textContent = '+' + Math.round(gain).toLocaleString() + '€';
document.getElementById('salary-results').style.display = 'block';
```

}

function calculateLanguage() {
const niveau = parseFloat(document.getElementById(‘niveau-cible’).value) || 600;
const heures = parseFloat(document.getElementById(‘heures-semaine’).value) || 6;

```
const semaines = niveau / heures;
const mois = semaines / 4.33;

document.getElementById('result-heures').textContent = niveau + 'h';
document.getElementById('result-semaines').textContent = Math.round(semaines) + ' sem (' + mois.toFixed(1) + ' mois)';
document.getElementById('language-results').style.display = 'block';
```

}

function calculateNutrition() {
const budget = parseFloat(document.getElementById(‘budget-alim’).value) || 200;
const repasRU = parseInt(document.getElementById(‘repas-ru’).value) || 5;

```
const budgetRU = repasRU * 3.30 * 4; // 4 semaines
const budgetCourses = budget - budgetRU;
const repasTotal = 60; // 2 repas/jour * 30 jours
const coutRepas = budget / repasTotal;

document.getElementById('result-budget-ru').textContent = budgetRU.toFixed(0) + '€';
document.getElementById('result-budget-courses').textContent = budgetCourses.toFixed(0) + '€';
document.getElementById('result-cout-repas').textContent = coutRepas.toFixed(2) + '€';
document.getElementById('nutrition-results').style.display = 'block';
```

}

function calculateReputation() {
const positives = parseFloat(document.getElementById(‘interactions-positives’).value) || 0;
const total = parseFloat(document.getElementById(‘total-interactions’).value) || 1;

```
const score = (positives / (total + 1)) * 100;

document.getElementById('result-reputation').textContent = score.toFixed(0) + '/100';
document.getElementById('reputation-results').style.display = 'block';
```

}

function calculateRatio() {
const epaules = parseFloat(document.getElementById(‘tour-epaules’).value) || 0;
const taille = parseFloat(document.getElementById(‘tour-taille’).value) || 1;

```
const ratio = epaules / taille;

document.getElementById('result-ratio').textContent = ratio.toFixed(2);

let interpretation;
if (ratio >= 1.4) {
    interpretation = "Excellent ! Ratio très attractif (Top 10%)";
} else if (ratio >= 1.35) {
    interpretation = "Très bon ! Ratio attractif";
} else if (ratio >= 1.3) {
    interpretation = "Bon ratio, potentiel d'amélioration";
} else {
    interpretation = "À améliorer : concentrez-vous sur les épaules et le dos";
}

document.getElementById('ratio-interpretation').textContent = interpretation;
document.getElementById('ratio-results').style.display = 'block';
```

}

// Pomodoro Timer
let pomodoroInterval = null;
let pomodoroSeconds = 25 * 60; // 25 minutes

function startPomodoro() {
const btn = document.getElementById(‘pomodoro-btn’);
const timer = document.getElementById(‘pomodoro-timer’);

```
if (pomodoroInterval) {
    // Stop
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    btn.innerHTML = '<span>Démarrer</span>';
    pomodoroSeconds = 25 * 60;
    timer.textContent = '25:00';
} else {
    // Start
    btn.innerHTML = '<span>Arrêter</span>';
    pomodoroInterval = setInterval(() => {
        pomodoroSeconds--;
        
        if (pomodoroSeconds <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            btn.innerHTML = '<span>Démarrer</span>';
            pomodoroSeconds = 25 * 60;
            timer.textContent = '25:00';
            alert('⏰ Pomodoro terminé ! Prenez une pause de 5 minutes.');
        } else {
            const mins = Math.floor(pomodoroSeconds / 60);
            const secs = pomodoroSeconds % 60;
            timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);
}
```

}

// ==========================================
// DASHBOARD UPDATE
// ==========================================

function updateDashboard(metric, value) {
const updates = {
‘iplf’: () => {
document.getElementById(‘dashboard-iplf’).textContent = value.toFixed(2) + ‘%’;
document.getElementById(‘iplf-progress’).style.width = Math.min(100, value) + ‘%’;
},
‘ses’: () => {
const sesValue = value / 100; // Convert back to 0-1 scale
document.getElementById(‘dashboard-ses’).textContent = sesValue.toFixed(2);
document.getElementById(‘ses-progress’).style.width = Math.min(100, value) + ‘%’;
},
‘health’: () => {
document.getElementById(‘dashboard-health’).textContent = Math.round(value) + ‘/100’;
document.getElementById(‘health-progress’).style.width = value + ‘%’;
},
‘attractivity’: () => {
const attractValue = value / 100; // Convert to 0-1 scale
document.getElementById(‘dashboard-attractivity’).textContent = attractValue.toFixed(2);
document.getElementById(‘attractivity-progress’).style.width = value + ‘%’;
}
};

```
if (updates[metric]) {
    updates[metric]();
}
```

}

// ==========================================
// INITIALIZE DASHBOARD CHART
// ==========================================

function initDashboardChart() {
const ctx = document.getElementById(‘iplfChart’);

```
// Sample data
const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const data = [0, 0.2, 0.4, 0.7, 1.0, 1.3, 1.7, 2.1, 2.5, 3.0, 3.5, 4.0];

new Chart(ctx, {
    type: 'line',
    data: {
        labels: months,
        datasets: [{
            label: 'IPLF (%)',
            data: data,
            borderColor: 'rgba(0, 217, 255, 1)',
            backgroundColor: 'rgba(0, 217, 255, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: '#e5e7eb',
                    font: {
                        family: "'JetBrains Mono', monospace"
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#9ca3af'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'IPLF (%)',
                    color: '#9ca3af',
                    font: {
                        family: "'Orbitron', sans-serif"
                    }
                },
                ticks: {
                    color: '#9ca3af',
                    callback: function(value) {
                        return value.toFixed(1) + '%';
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        }
    }
});
```

}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener(‘DOMContentLoaded’, function() {
// Initialize navigation
initNavigation();

```
// Initialize sliders
initSliders();

// Render formulas
renderFormulas();

// Initialize dashboard chart
initDashboardChart();

// Load saved data
DataManager.loadAll();

console.log('✅ Manuel d\'Optimisation Humaine - Initialisé');
```

});
