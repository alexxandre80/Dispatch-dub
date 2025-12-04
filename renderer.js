// URL du repository Git fixe
const REPO_URL = 'https://github.com/alexxandre80/Dispatch-dub';

const form = document.getElementById('syncForm');
const repoUrlInput = document.getElementById('repoUrl');
const languageSelect = document.getElementById('language');
const destinationPathInput = document.getElementById('destinationPath');
const browseBtn = document.getElementById('browseBtn');
const syncBtn = document.getElementById('syncBtn');
const statusDiv = document.getElementById('status');
const progressDiv = document.getElementById('progress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Fonction pour afficher un message de statut
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
}

// Fonction pour masquer le statut
function hideStatus() {
  statusDiv.style.display = 'none';
}

// Fonction pour mettre à jour la barre de progression
function updateProgress(percent, text = '') {
  progressFill.style.width = `${percent}%`;
  if (text) {
    progressText.textContent = text;
  }
}

// Fonction pour afficher/masquer la progression
function showProgress(show = true) {
  if (show) {
    progressDiv.classList.add('active');
  } else {
    progressDiv.classList.remove('active');
    updateProgress(0, '');
  }
}

// Gérer le bouton de parcours
browseBtn.addEventListener('click', async () => {
  try {
    const path = await window.electronAPI.selectDestinationFolder();
    if (path) {
      destinationPathInput.value = path;
    }
  } catch (error) {
    showStatus('Erreur lors de la sélection du dossier : ' + error.message, 'error');
  }
});

// Gérer la soumission du formulaire
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const language = languageSelect.value;
  const destinationPath = destinationPathInput.value.trim();

  if (!language || !destinationPath) {
    showStatus('Veuillez sélectionner une langue et un chemin de destination', 'error');
    return;
  }

  // Désactiver le bouton et afficher la progression
  syncBtn.disabled = true;
  hideStatus();
  showProgress(true);
  updateProgress(10, 'Initialisation...');

  try {
    updateProgress(30, 'Téléchargement du repository...');
    await window.electronAPI.downloadAndReplaceFiles(REPO_URL, language, destinationPath);
    
    updateProgress(100, 'Terminé !');
    showStatus('Fichiers synchronisés avec succès !', 'success');
    
    setTimeout(() => {
      showProgress(false);
      syncBtn.disabled = false;
    }, 2000);
  } catch (error) {
    showProgress(false);
    showStatus('Erreur : ' + error.message, 'error');
    syncBtn.disabled = false;
  }
});

