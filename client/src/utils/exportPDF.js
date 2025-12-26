import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export Progress Report as PDF
 * @param {Object} data - Progress data including skills, goals, analytics
 */
export const exportProgressReport = async (data) => {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let yPos = margin;

        // Header
        pdf.setFontSize(24);
        pdf.setTextColor(139, 92, 246); // Purple accent
        pdf.text('Career Progress Report', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;

        // Analytics Summary
        if (data.analytics) {
            pdf.setFontSize(16);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Summary', margin, yPos);
            yPos += 8;

            pdf.setFontSize(10);
            pdf.setTextColor(60, 60, 60);

            const stats = [
                `Total Skills: ${data.analytics.totalSkills || 0}`,
                `Average Skill Level: ${data.analytics.averageLevel || 0}%`,
                `Active Goals: ${data.analytics.activeGoals || 0}`,
                `Completed Goals: ${data.analytics.completedGoals || 0}`
            ];

            stats.forEach(stat => {
                pdf.text(stat, margin + 5, yPos);
                yPos += 6;
            });
            yPos += 10;
        }

        // Skills Section
        if (data.skills && data.skills.length > 0) {
            pdf.setFontSize(16);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Skills Overview', margin, yPos);
            yPos += 8;

            pdf.setFontSize(9);

            // Sort skills by level
            const sortedSkills = [...data.skills].sort((a, b) => b.level - a.level);

            sortedSkills.forEach(skill => {
                if (yPos > pageHeight - 30) {
                    pdf.addPage();
                    yPos = margin;
                }

                // Skill name and level
                pdf.setTextColor(60, 60, 60);
                pdf.text(`${skill.name}`, margin + 5, yPos);

                // Level bar
                const barWidth = 50;
                const barHeight = 3;
                const barX = pageWidth - margin - barWidth - 20;

                // Background bar
                pdf.setFillColor(230, 230, 230);
                pdf.rect(barX, yPos - 3, barWidth, barHeight, 'F');

                // Progress bar with color based on level
                let color;
                if (skill.level <= 25) color = [239, 68, 68]; // Red
                else if (skill.level <= 50) color = [234, 179, 8]; // Yellow
                else if (skill.level <= 75) color = [59, 130, 246]; // Blue
                else color = [34, 197, 94]; // Green

                pdf.setFillColor(...color);
                pdf.rect(barX, yPos - 3, (barWidth * skill.level) / 100, barHeight, 'F');

                // Level percentage
                pdf.setTextColor(...color);
                pdf.text(`${skill.level}%`, pageWidth - margin - 15, yPos, { align: 'right' });

                yPos += 7;
            });
            yPos += 10;
        }

        // Goals Section
        if (data.goals && data.goals.length > 0) {
            if (yPos > pageHeight - 60) {
                pdf.addPage();
                yPos = margin;
            }

            pdf.setFontSize(16);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Active Goals', margin, yPos);
            yPos += 8;

            pdf.setFontSize(9);

            data.goals.forEach(goal => {
                if (yPos > pageHeight - 40) {
                    pdf.addPage();
                    yPos = margin;
                }

                // Goal title
                pdf.setTextColor(60, 60, 60);
                pdf.setFont(undefined, 'bold');
                pdf.text(goal.title, margin + 5, yPos);
                pdf.setFont(undefined, 'normal');
                yPos += 5;

                // Goal details
                pdf.setFontSize(8);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Target: ${goal.targetSkill} - Level ${goal.targetLevel}`, margin + 5, yPos);
                yPos += 4;
                pdf.text(`Deadline: ${new Date(goal.deadline).toLocaleDateString()}`, margin + 5, yPos);
                yPos += 4;

                // Progress bar
                const barWidth = 60;
                const barHeight = 4;
                const barX = margin + 5;

                pdf.setFillColor(230, 230, 230);
                pdf.rect(barX, yPos - 2, barWidth, barHeight, 'F');

                pdf.setFillColor(139, 92, 246); // Purple
                pdf.rect(barX, yPos - 2, (barWidth * goal.progress) / 100, barHeight, 'F');

                pdf.setFontSize(9);
                pdf.setTextColor(139, 92, 246);
                pdf.text(`${goal.progress}%`, barX + barWidth + 3, yPos + 1);

                yPos += 10;
            });
            yPos += 5;
        }

        // Chart Section (if element exists)
        const chartElement = document.getElementById('skill-progress-chart');
        if (chartElement) {
            pdf.addPage();
            yPos = margin;

            pdf.setFontSize(16);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Skill Progress Chart', margin, yPos);
            yPos += 10;

            try {
                const canvas = await html2canvas(chartElement, {
                    scale: 2,
                    backgroundColor: '#ffffff'
                });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - (2 * margin);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, Math.min(imgHeight, 120));
            } catch (error) {
                console.error('Failed to capture chart:', error);
            }
        }

        // Footer on last page
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
            'Generated by AI Career Advisor',
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );

        // Save PDF
        const fileName = `career-progress-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

        return { success: true, fileName };
    } catch (error) {
        console.error('PDF Export Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Export Application Details as PDF
 * @param {Object} application - Application data
 */
export const exportApplicationPDF = async (application) => {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;
        let yPos = margin;

        // Header
        pdf.setFontSize(20);
        pdf.setTextColor(139, 92, 246);
        pdf.text('Job Application Details', pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;

        // Company & Position
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(application.jobTitle, margin, yPos);
        yPos += 7;

        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text(application.company, margin, yPos);
        yPos += 10;

        // Details
        pdf.setFontSize(10);
        const details = [
            `Location: ${application.location || 'N/A'}`,
            `Salary: ${application.salary || 'N/A'}`,
            `Status: ${application.status}`,
            `Applied: ${new Date(application.appliedDate).toLocaleDateString()}`
        ];

        details.forEach(detail => {
            pdf.text(detail, margin, yPos);
            yPos += 6;
        });
        yPos += 10;

        // Notes
        if (application.notes) {
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Notes:', margin, yPos);
            yPos += 7;

            pdf.setFontSize(10);
            pdf.setTextColor(60, 60, 60);
            const lines = pdf.splitTextToSize(application.notes, pageWidth - 2 * margin);
            pdf.text(lines, margin, yPos);
            yPos += lines.length * 5 + 10;
        }

        pdf.save(`application-${application.company.replace(/\s+/g, '-')}.pdf`);
        return { success: true };
    } catch (error) {
        console.error('PDF Export Error:', error);
        return { success: false, error: error.message };
    }
};
