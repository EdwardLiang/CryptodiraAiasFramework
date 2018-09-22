let PlayerEventListener = {

    handleEvent(e){
        socket.emit('key', this.getJSONKeyCode(e));
    },

    getJSONKeyCode(e){
        return JSON.stringify(e, ['keyCode', 'shiftKey']);
    }
}
