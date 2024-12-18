export const Storage = {
    saveTeam: function(team) {
        const teams = this.getAllTeams();
        
        team.timestamp = Date.now();
        team.totalPoints = 0;
        team.username = `User${teams.length + 1}`;

        teams.push(team);
        localStorage.setItem('draftedTeams', JSON.stringify(teams));
    },

    getAllTeams: function() {
        const teams = localStorage.getItem('draftedTeams');
        return teams ? JSON.parse(teams) : [];
    }
};