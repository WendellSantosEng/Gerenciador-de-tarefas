import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path from 'path';
import { LoginModel } from '../models/LoginModel';

export const getUserInfo = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        if (request.session.user) {
            const { email, iduser, name } = request.session.user;
            return reply.send({ email, iduser, name });
        } else {
            return reply.status(401).send({ error: 'Usuário não está logado.' });
        }
    } catch (e) {
        console.error(e);
        return reply.status(500).send({ error: 'Erro no servidor.' });
    }
};

interface MulterFile {
    filename: string;
    file: fs.ReadStream;
}

export const uploadProfilePic = async (req: any, res: FastifyReply) => {
    try {
        console.log('Recebendo arquivo...');
        const data: MulterFile = await req.file();  // Obtém o arquivo da requisição
        if (!data) {
            console.log('Nenhuma imagem foi enviada.');
            return res.status(400).send('Nenhuma imagem foi enviada.');
        }

        const uploadPath = path.join(__dirname, '..', 'uploads', `image-${Date.now()}${path.extname(data.filename)}`);
        console.log('Caminho do upload:', uploadPath);

        // Cria o arquivo de destino
        const writeStream = fs.createWriteStream(uploadPath);
        data.file.pipe(writeStream);

        writeStream.on('finish', async () => {
            // Salvar a URL da imagem no banco de dados
            const imageUrl = `/uploads/${path.basename(uploadPath)}`;
            console.log('URL da imagem:', imageUrl);

            try {
                // Aqui, encontramos ou criamos um usuário com base no e-mail
                const user = await LoginModel.findOneAndUpdate(
                    { email: req.body.email }, // Supondo que o e-mail esteja no corpo da requisição
                    { profilePic: imageUrl },
                    { upsert: true, new: true }
                );
                console.log('Usuário atualizado:', user);
                res.status(200).send({
                    success: true,
                    profilePic: imageUrl,
                    message: 'Imagem de perfil enviada e salva com sucesso!',
                    user
                });
            } catch (err) {
                console.error('Erro ao salvar a imagem no banco de dados:', err);
                res.status(500).send('Erro ao salvar a imagem no banco de dados.');
            }
        });

        writeStream.on('error', (err) => {
            console.error('Erro ao escrever o arquivo:', err);
            res.status(500).send('Erro ao escrever o arquivo.');
        });
    } catch (error) {
        console.error('Erro ao processar upload de imagem:', error);
        res.status(500).send({ success: false, message: 'Erro ao processar upload de imagem' });
    }
};