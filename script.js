       document.addEventListener('DOMContentLoaded', function() {
            const generateBtn = document.getElementById('generate-btn');
            const downloadBtn = document.getElementById('download-btn');
            const resetBtn = document.getElementById('reset-btn');
            const preview = document.getElementById('markdown-preview');
            const progressFill = document.getElementById('progress-fill');
            const feedbackOverlay = document.getElementById('feedback-overlay');
            const closeFeedback = document.getElementById('close-feedback');
            const skipFeedback = document.getElementById('skip-feedback');
            const submitFeedback = document.getElementById('submit-feedback');
            const feedbackText = document.getElementById('feedback-text');
            
            // Form elements
            const projectName = document.getElementById('project-name');
            const description = document.getElementById('project-description');
            const features = document.getElementById('project-features');
            const installation = document.getElementById('installation');
            const usage = document.getElementById('usage');
            const contributing = document.getElementById('contributing');
            const support = document.getElementById('support');
            const license = document.getElementById('license');
            const credits = document.getElementById('credits');
            
            // Update progress bar based on form completion
            function updateProgress() {
                let completed = 0;
                const fields = [projectName, description, features, installation, usage, license];
                
                fields.forEach(field => {
                    if (field.value.trim() !== '') completed++;
                });
                
                const percentage = (completed / fields.length) * 100;
                progressFill.style.width = `${percentage}%`;
                progressFill.parentElement.nextElementSibling.textContent = `${Math.round(percentage)}%`;
                
                // Update step text
                const stepText = document.querySelector('.progress-container span:first-child');
                if (percentage < 25) {
                    stepText.textContent = 'Step 1 of 4';
                } else if (percentage < 50) {
                    stepText.textContent = 'Step 2 of 4';
                } else if (percentage < 75) {
                    stepText.textContent = 'Step 3 of 4';
                } else {
                    stepText.textContent = 'Step 4 of 4';
                }
            }
            
            // Add input events to all form fields
            const allFields = [projectName, description, features, installation, usage, contributing, support, license, credits];
            allFields.forEach(field => {
                field.addEventListener('input', updateProgress);
                field.addEventListener('input', updatePreview);
            });
            
            // Update the preview as user types
            function updatePreview() {
                const featuresList = features.value.split('\n').filter(line => line.trim() !== '');
                
                let previewText = `# ${projectName.value || 'Project Name'}\n\n`;
                previewText += `${description.value || 'Your project description will appear here.'}\n\n`;
                
                if (featuresList.length > 0) {
                    previewText += '## Features\n';
                    featuresList.forEach(feature => {
                        previewText += `- ${feature}\n`;
                    });
                    previewText += '\n';
                }
                
                if (installation.value) {
                    previewText += '## Installation\n';
                    previewText += `${installation.value}\n\n`;
                }
                
                if (usage.value) {
                    previewText += '## Usage\n';
                    previewText += `${usage.value}\n\n`;
                }
                
                if (contributing.value) {
                    previewText += '## Contributing\n';
                    previewText += `${contributing.value}\n\n`;
                }
                
                if (support.value) {
                    previewText += '## Support\n';
                    previewText += `${support.value}\n\n`;
                }
                
                if (license.value) {
                    previewText += '## License\n';
                    let licenseText = '';
                    switch(license.value) {
                        case 'MIT': licenseText = 'Anyone can use it freely'; break;
                        case 'Apache': licenseText = 'Can use but must give credit'; break;
                        case 'GPL': licenseText = 'Can use but must share improvements'; break;
                        case 'BSD': licenseText = 'Similar to MIT'; break;
                        case 'None': licenseText = 'Only with my permission'; break;
                        default: licenseText = `This project is licensed under the ${license.value} License.`;
                    }
                    previewText += `${licenseText}\n\n`;
                }
                
                if (credits.value) {
                    previewText += '## Credits\n';
                    previewText += `${credits.value}\n`;
                }
                
                preview.textContent = previewText;
            }
            
            // Show feedback popup
            function showFeedbackPopup() {
                feedbackOverlay.style.opacity = '1';
                feedbackOverlay.style.pointerEvents = 'auto';
                
                // If user doesn't interact, show again after 5 seconds
                setTimeout(() => {
                    if (feedbackOverlay.style.opacity === '0' || feedbackOverlay.style.opacity === '') {
                        showFeedbackPopup();
                    }
                }, 5000);
            }
            
            // Hide feedback popup
            function hideFeedbackPopup() {
                feedbackOverlay.style.opacity = '0';
                feedbackOverlay.style.pointerEvents = 'none';
            }
            
            // Generate README
            generateBtn.addEventListener('click', function() {
                updatePreview();
                downloadBtn.disabled = false;
                
                // Trigger confetti
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#9370DB', '#8A2BE2', '#ffffff']
                });
                
                // Show feedback popup after a short delay
                setTimeout(showFeedbackPopup, 1500);
                
                // Smooth scroll to preview
                document.querySelector('.preview-container').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
            
            // Download README
            downloadBtn.addEventListener('click', function() {
                const content = preview.textContent;
                const blob = new Blob([content], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'README.md';
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                setTimeout(function() {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            });
            
            // Reset form
            resetBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to start over? All your inputs will be cleared.')) {
                    allFields.forEach(field => {
                        field.value = '';
                    });
                    updatePreview();
                    updateProgress();
                    downloadBtn.disabled = true;
                }
            });
            
            // Feedback handlers
            closeFeedback.addEventListener('click', hideFeedbackPopup);
            skipFeedback.addEventListener('click', hideFeedbackPopup);
            submitFeedback.addEventListener('click', function() {
                if (feedbackText.value.trim() !== '') {
                    alert('Thank you for your feedback! 💜');
                } else {
                    alert('Thanks for considering! Feel free to share feedback later.');
                }
                hideFeedbackPopup();
            });
            
            // Initialize preview
            updatePreview();
        });