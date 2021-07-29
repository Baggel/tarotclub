
/**
 * -1 = compte désactivé
 * 0 = email non validé
 * 1 = utilisateur normal
 */

function isActive(status) {
    return status >= 0 ;
}

module.exports = {
    isActive
}
