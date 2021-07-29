const { ImapFlow } = require('imapflow');
const config = {
    host: process.env.MAIL_SERVER,
    port: 993,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
}


const scanForNewMessages = async () => {

    let client = new ImapFlow(config);
    let allMails = [];

    // Wait until client connects and authorizes
    await client.connect();

    // Select and lock a mailbox. Throws if mailbox does not exist
    let lock = await client.getMailboxLock('INBOX');
    try {

        for await (let message of client.fetch(
            {unseen: true},
            {
                uid: true,
                flags: true,
                bodyStructure: true,
                envelope: true,
                internalDate: true,
                emailId: true,
                threadId: true,
                xGmLabels: true,
                headers: ['date', 'subject'],
                bodyParts: [
                    'text',
                ]
            }
        )) {

            let body = "";
            for (const [key, value] of message.bodyParts.entries()) {
                body += value.toString();
          //      console.log(value.toString());
            }

            if (message.bodyStructure.encoding === "base64") {
                const buf = Buffer.from(body, 'base64');

                let encoding = 'latin1';
                if (message.bodyStructure.parameters.charset === "utf-8") {
                    encoding = 'utf8';
                }
                body = buf.toString(encoding);
            }

            allMails.push({ uid: message.uid, body: body});
        }


    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release();
    }

    // log out and close connection
    await client.logout();

    console.log('Found ' + allMails.length + ' new mails.');

    return allMails;
};


const setSeen = async (list) => 
{

    let client = new ImapFlow(config);
    // Wait until client connects and authorizes
    await client.connect();

    // Select and lock a mailbox. Throws if mailbox does not exist
    let lock = await client.getMailboxLock('INBOX');
    try {
        // mark all unseen messages as seen (and keep other flags as is)

        if (list.length == 0) {
            await client.messageFlagsAdd('1:*', ['\\Seen']);
        } else {
            await client.messageFlagsAdd(list, ['\\Seen'], { uid: true });
        }
 
    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release();
    }

    // log out and close connection
    await client.logout();
};


const deleteMessages = async (list) => 
{

    let client = new ImapFlow(config);
    // Wait until client connects and authorizes
    await client.connect();

    // Select and lock a mailbox. Throws if mailbox does not exist
    let lock = await client.getMailboxLock('INBOX');
    try {
        // mark all unseen messages as seen (and keep other flags as is)

        if (list.length == 0) {
            await client.messageDelete('1:*', ['\\Seen']);
        } else {
            await client.messageDelete(list, ['\\Seen'], { uid: true });
        }
 
    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release();
    }

    // log out and close connection
    await client.logout();
};

module.exports = {
    scanForNewMessages,
    setSeen,
    deleteMessages
}

