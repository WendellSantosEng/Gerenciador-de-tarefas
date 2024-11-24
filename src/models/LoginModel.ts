import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

// Interface ILogin define o tipo de documento MongoDB com o campo iduser
interface ILogin extends Document {
    iduser: string;
    email: string;
    password: string;
    name: string;
    profilePic: string;
}

// Schema do MongoDB para Login com o campo iduser
const LoginSchema: Schema = new Schema({
    iduser: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: '' },
    profilePic: { type: String },
});

// Modelo Mongoose
const LoginModel = mongoose.model<ILogin>('Login', LoginSchema);

class Login {
    static findOneAndUpdate(arg0: { email: string; }, arg1: { profilePic: string; }, arg2: { new: boolean; }) {
        throw new Error('Method not implemented.');
    }
    body: { iduser?: string; email: string; password: string; name?: string };
    errors: string[];
    user: ILogin | null;

    constructor(body: { iduser?: string; email: string; password: string; name?: string }) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login(): Promise<void> {
        this.valida();
        if (this.errors.length > 0) return;

        const user = await LoginModel.findOne({ email: this.body.email });

        if (!user) {
            this.errors.push('Usuário não existe');
            return;
        }

        if (!bcrypt.compareSync(this.body.password, user.password)) {
            this.errors.push('Senha inválida');
            this.user = null;
            return;
        }

        this.user = user;
    }

    async register(): Promise<void> {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        // Gera um ID único para o usuário
        this.body.iduser = await generateUniqueId();

        if (!this.body.name) this.body.name = this.body.email;

        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt);

        this.user = await LoginModel.create(this.body);
    }

    async userExists(): Promise<void> {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push('Usuário já existe.');
    }

    async update(): Promise<void> {
        if (this.errors.length > 0) return;
        this.valida();

        if (this.errors.length > 0) return;

        // Verifica se o e-mail já está em uso
        if (this.body.email) {
            const existingUser = await LoginModel.findOne({ email: this.body.email });
            if (existingUser && existingUser.iduser !== this.body.iduser) {
                this.errors.push('E-mail já em uso.');
                return;
            }
        }

        // Se a senha foi alterada, atualiza com hash
        if (this.body.password) {
            const salt = bcrypt.genSaltSync();
            this.body.password = bcrypt.hashSync(this.body.password, salt);
        }

        // Atualiza o usuário no banco
        this.user = await LoginModel.findOneAndUpdate({ iduser: this.body.iduser }, this.body, { new: true });
    }

    valida(): void {
        this.cleanUp();

        // Validação de e-mail
        if (!validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }

        // Validação de senha
        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
        }
    }

    cleanUp(): void {
        if (this.body && typeof this.body === 'object') {
            const keys = Object.keys(this.body) as Array<keyof typeof this.body>;
            for (const key of keys) {
                this.body[key] = typeof this.body[key] === 'string' ? this.body[key] : '';
            }
        }
    }
}

// Função para gerar ID único do usuário
const generateUniqueId = async (): Promise<string> => {
    let uniqueId: string;
    let exists: boolean;

    do {
        uniqueId = `#${Math.floor(100000 + Math.random() * 900000)}`;
        exists = !!(await LoginModel.findOne({ iduser: uniqueId })); 
    } while (exists);

    return uniqueId;
};

export { LoginModel, ILogin };
export default Login;