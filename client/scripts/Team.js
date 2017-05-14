(function () {
    /**
     * Team object modelling team state and structure
     */
    function Team(id) {
        this.id = id;
        this.players = [];
    }

    function addTeamMember(player){
        players.push(player);
    }

    function getTeamMember(number){
        for(var i = 0; i < players.length; i++){
            if(i === number){
                return players[i];
            }else{
                //TODO: error message player doesn't exist
                return null;
            }
        }
        //TODO: error message player doesn't exist
        return null;
    }


    module.exports = Team;
})();