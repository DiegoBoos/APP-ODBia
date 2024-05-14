export enum EventSocket {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    LOGGED = 'logged-user',
    LOGOUT = 'logout-user',
    FAILED_AUTH = 'failed-auth',
    GET_PROGRESS_UPLOAD = 'get-progress-upload',
    GET_PROGRESS_CREATE_DIR = 'get-progress-create-dir'
}