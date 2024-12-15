export const Storage = {
    saveTeam: function(team) {
        // Get existing teams or initialize empty array
        const teams = this.getAllTeams();
        
        // Add timestamp and initial points
        team.timestamp = Date.now();
        team.points = 0;
        team.username = `User${teams.length + 1}`; // Simple username generation

        // Add new team
        teams.push(team);
        
        // Save back to localStorage
        localStorage.setItem('draftedTeams', JSON.stringify(teams));
    },

    getAllTeams: function() {
        const teams = localStorage.getItem('draftedTeams');
        return teams ? JSON.parse(teams) : [];
    },

    updateTeamPoints: function(username, points) {
        const teams = this.getAllTeams();
        const team = teams.find(t => t.username === username);
        if (team) {
            team.points = points;
            localStorage.setItem('draftedTeams', JSON.stringify(teams));
        }
    }
};