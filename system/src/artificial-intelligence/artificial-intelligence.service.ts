import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArtificialIntelligenceDto } from './dto/create-artificial-intelligence.dto';
import { UpdateArtificialIntelligenceDto } from './dto/update-artificial-intelligence.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class ArtificialIntelligenceService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createArtificialIntelligenceDto: CreateArtificialIntelligenceDto, companyId: string) {

    const { baseUrl } = await this.prisma.artificialIntelligenceType.findUnique({
      where: {
        platform: createArtificialIntelligenceDto.platform
      }
    })

    const data: Prisma.ArtificialIntelligenceCreateInput = {
      apiKey: createArtificialIntelligenceDto.apiKey,
      prompt: createArtificialIntelligenceDto.prompt,
      company: {
        connect: {
          id: companyId
        }
      },
      projectId: "proj_xNEAYCaKQsfkhd0botzEMZO1",
      artificialIntelligenceType: {
        connect: {
          platform_baseUrl: {
            baseUrl: baseUrl,
            platform: createArtificialIntelligenceDto.platform
          }
        }
      },
      artificialIntelligenceModel: {
        connect: {
          model: createArtificialIntelligenceDto.model
        }
      }
    }

    const createArtificialIntelligence = await this.prisma.artificialIntelligence.create({ data });

    if (createArtificialIntelligence) {
      return {
        statusCode: 201,
        message: 'Dados da Inteligência Artificial cadastrada!',
        data: createArtificialIntelligence
      }
    } else {
      throw new InternalServerErrorException('Erro crítico, contate o suporte!')
    } 

  }

  private async openAI (companyId: string) {
    
    const artificialIntelligence = await this.prisma.artificialIntelligence.findFirst({
      where: {
        companyId: companyId
      }
    });

    const openai = new OpenAI({
      apiKey: artificialIntelligence.apiKey,
      baseURL: artificialIntelligence.baseUrl
    })

    return {
      openai,
      artificialIntelligence
    }

  }

  async AI( companyId: string, message: string ) {

    console.log(message)

    const { openai, artificialIntelligence } = await this.openAI(companyId)

    const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { 
        role: "system", 
        content: artificialIntelligence.prompt
      },
      {
        role: "user",
        content: message
      },        
    ];


    const response = await openai.chat.completions.create({
      model: artificialIntelligence.model,
      messages: context,
      tools: [
        {
          type: 'function',
          function: {
            "name": "verificar_horarios_disponiveis",
            "description": "Essa função consulta os horários disponíveis para um especialista e serviço em uma data específica. Ela deve ser acionada apenas quando o usuário fornece informações de data, especialista e serviços, mas não menciona uma hora específica. Se o usuário mencionar uma hora ou fizer uma solicitação de agendamento direto, essa função não deve ser chamada.",
            "strict": true,
            "parameters": {
              "type": "object",
              "required": [
                "data",
                "especialista",
                "servicos"
              ],
              "properties": {
                "data": {
                  "type": "string",
                  "description": "A data para a qual os horários disponíveis devem ser verificados, no formato DD-MM."
                },
                "especialista": {
                  "type": "string",
                  "description": "Nome do especialista que será consultado."
                },
                "servicos": {
                  "type": "string",
                  "description": "Lista de serviços solicitados obtendo o substantivo da frase se houver e corrigindo os erros de digitação, separados por ponto e vírgula ';'."
                }
              },
              "additionalProperties": false
            }
          },
        },
        {
          type: 'function',
          function: {
            "name": "agendar_servico_horario",
            "description": "Confirmar o agendamento do serviço no sistema, obrigatório o especialista, o serviço, a data e a hora selecionada. Ativada quando todas as informações (data, especialista, serviços e hora) são fornecidas.",
            "strict": true,
            "parameters": {
              "type": "object",
              "required": [
                "data",
                "especialista",
                "hora",
                "servicos"
              ],
              "properties": {
                "data": {
                  "type": "string",
                  "description": "Data em que o serviço será realizado, no formato DD-MM."
                },
                "especialista": {
                  "type": "string",
                  "description": "Nome do especialista que realizará o serviço"
                },
                "hora": {
                  "type": "string",
                  "description": "Hora em que o serviço será realizado, no formato HH:MM"
                },
                "servicos": {
                  "type": "string",
                  "description": "Lista de serviços solicitados, obtendo o substantivo da frase se houver, exemplos: barba, cabelo, dente, etc e corrigindo os erros de digitação, separados por ponto e vírgula ';'."
                }
              },
              "additionalProperties": false
            }
          }
        }
      ],
      tool_choice: 'auto'
    });

    if (response.choices[0].finish_reason == "tool_calls" || response.choices[0].finish_reason == "stop") {
      const toolCalls = response.choices[0].message.tool_calls;

      for (const toolCall of toolCalls) {

        if (toolCall.function) {
          const functionName = toolCall.function.name;

          if (functionName == "verificar_horarios_disponiveis") {
            context.push(response.choices[0].message);
            context.push({
              role: "tool",
              content: "9:00, 10:00, 11:00",
              tool_call_id: toolCall.id
            })
          }

          
        }
      }
    }

    const completion2 = await openai.chat.completions.create({
      model: artificialIntelligence.model,
      messages: context,
    });

    return completion2.choices[0].message.content
  }

  findOne(id: number) {
    return `This action returns a #${id} artificialIntelligence`;
  }

  update(id: number, updateArtificialIntelligenceDto: UpdateArtificialIntelligenceDto) {
    return `This action updates a #${id} artificialIntelligence`;
  }

  remove(id: number) {
    return `This action removes a #${id} artificialIntelligence`;
  }
}
