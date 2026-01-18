import { Card } from './card';

export const NotFoundComponent = () => {
  return (
    <div className="flex items-center max-w-145">
      <Card size="large">
        <div className="flex flex-col items-center gap-6">
          <img src="/not_found.svg" alt="Erro 404" height={85} width={194} />
          <h1 className="text-xl text-gray-600">Link não encontrado</h1>
          <div className="flex flex-col text-base text-gray-500 text-center">
            <p>
              O link que você está tentando acessar não existe, foi removido ou
              é uma URL inválida. Saiba mais em{' '}
              <a href="/" className="text-blue-base underline">
                brev.ly
              </a>
              .
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
