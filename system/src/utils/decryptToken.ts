import * as jwt from 'jsonwebtoken';

interface TokenPayload {
    email: string
    sub: string
    companyId: string
}


function isTokenPayload(decoded: any): decoded is TokenPayload {
    return (
        typeof decoded === 'object' &&
        'email' in decoded &&
        'sub' in decoded &&
        'companyId' in decoded
    );
}

export default async function DecryptToken(token) {

    const tokenNoBearer = await token.authorization.replace('Bearer ', '');
    const decoded = jwt.verify(await tokenNoBearer, process.env.JWT_SECRET);

    if (isTokenPayload(decoded)) {
        return {
            email: decoded.email,
            id: decoded.sub,
            companyId: decoded.companyId,
        };
    }

    throw new Error('Token inválido ou não possui os campos necessários.');
}
