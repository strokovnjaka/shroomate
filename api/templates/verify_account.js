module.exports = {
    'subject': 'Activate your Shroomate account',
    'body': (params) => {
        return `
Welcome to Shroomate!

Click the link to activate your account 
${params.link}/${params.token}
`
    }
}