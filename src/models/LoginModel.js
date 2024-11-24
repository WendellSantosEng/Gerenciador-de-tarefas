"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Schema do MongoDB para Login com o campo iduser
const LoginSchema = new mongoose_1.Schema({
    iduser: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: '' },
    profilePic: { type: String },
});
// Modelo Mongoose
const LoginModel = mongoose_1.default.model('Login', LoginSchema);
exports.LoginModel = LoginModel;
class Login {
    static findOneAndUpdate(arg0, arg1, arg2) {
        throw new Error('Method not implemented.');
    }
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            this.valida();
            if (this.errors.length > 0)
                return;
            const user = yield LoginModel.findOne({ email: this.body.email });
            if (!user) {
                this.errors.push('Usuário não existe');
                return;
            }
            if (!bcryptjs_1.default.compareSync(this.body.password, user.password)) {
                this.errors.push('Senha inválida');
                this.user = null;
                return;
            }
            this.user = user;
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            this.valida();
            if (this.errors.length > 0)
                return;
            yield this.userExists();
            if (this.errors.length > 0)
                return;
            // Gera um ID único para o usuário
            this.body.iduser = yield generateUniqueId();
            if (!this.body.name)
                this.body.name = this.body.email;
            const salt = bcryptjs_1.default.genSaltSync();
            this.body.password = bcryptjs_1.default.hashSync(this.body.password, salt);
            this.user = yield LoginModel.create(this.body);
        });
    }
    userExists() {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = yield LoginModel.findOne({ email: this.body.email });
            if (this.user)
                this.errors.push('Usuário já existe.');
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.errors.length > 0)
                return;
            this.valida();
            if (this.errors.length > 0)
                return;
            // Verifica se o e-mail já está em uso
            if (this.body.email) {
                const existingUser = yield LoginModel.findOne({ email: this.body.email });
                if (existingUser && existingUser.iduser !== this.body.iduser) {
                    this.errors.push('E-mail já em uso.');
                    return;
                }
            }
            // Se a senha foi alterada, atualiza com hash
            if (this.body.password) {
                const salt = bcryptjs_1.default.genSaltSync();
                this.body.password = bcryptjs_1.default.hashSync(this.body.password, salt);
            }
            // Atualiza o usuário no banco
            this.user = yield LoginModel.findOneAndUpdate({ iduser: this.body.iduser }, this.body, { new: true });
        });
    }
    valida() {
        this.cleanUp();
        // Validação de e-mail
        if (!validator_1.default.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }
        // Validação de senha
        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
        }
    }
    cleanUp() {
        if (this.body && typeof this.body === 'object') {
            const keys = Object.keys(this.body);
            for (const key of keys) {
                this.body[key] = typeof this.body[key] === 'string' ? this.body[key] : '';
            }
        }
    }
}
// Função para gerar ID único do usuário
const generateUniqueId = () => __awaiter(void 0, void 0, void 0, function* () {
    let uniqueId;
    let exists;
    do {
        uniqueId = `#${Math.floor(100000 + Math.random() * 900000)}`;
        exists = !!(yield LoginModel.findOne({ iduser: uniqueId }));
    } while (exists);
    return uniqueId;
});
exports.default = Login;
