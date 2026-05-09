export function parseServerErrorMessage(rawMessage: string): string {
    if (!rawMessage) return '';

    // Handle permission errors
    if (rawMessage.includes('Missing permission')) {
        const match = rawMessage.match(/Missing permission: (.*)/);
        if (match) {
            const permission = match[1];
            return `Accès refusé. Vous n'avez pas la permission nécessaire : ${permission}.`;
        }
        return "Accès refusé. Permission manquante.";
    }

    // Handle access denied errors
    if (rawMessage.includes('Access Denied')) {
        return "Accès refusé. Vous n'avez pas les autorisations nécessaires.";
    }

    // Handle generic unique constraint violation (PostgreSQL)
    if (rawMessage.includes("la valeur d'une clé dupliquée")) {
        // Try to extract the field and value from: « (field)=(value) »
        const match = rawMessage.match(/« \((.*?)\)=\((.*?)\) »/);
        if (match) {
            const field = match[1];
            const value = match[2];

            switch (field) {
                case 'email':
                    return `L'adresse e-mail ${value} est déjà utilisée.`;
                case 'matricule':
                    return `Le matricule ${value} est déjà utilisé.`;
                case 'numero_de_telephone':
                    return `Le numéro de téléphone ${value} est déjà utilisé.`;
                default:
                    return `La valeur du champ "${field}" (${value}) est déjà utilisée.`;
            }
        }

        return "Certaines informations existent déjà dans le système.";
    }

    // Generic SQL error
    if (rawMessage.includes("could not execute statement")) {
        return "Erreur lors de l'enregistrement. Veuillez vérifier les données.";
    }

    // Handle agency deletion error with related drivers or vehicles
    if (rawMessage.includes('Impossible to delete the data because it is related to drivers or vehicles')) {
        return "Impossible de supprimer cette agence car elle est liée à des conducteurs ou des véhicules.";
    }

    // Fallback for unhandled errors
    return "Une erreur est survenue. Veuillez réessayer.";
}