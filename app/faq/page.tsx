"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData = {
  pt: [
    {
      question: "Quais sao os metodos de pagamento aceites?",
      answer: "Aceitamos cartoes de credito/debito (Visa, Mastercard, American Express), PayPal, transferencia bancaria e MB Way. Todas as transacoes sao processadas de forma segura atraves da nossa plataforma Shopify.",
    },
    {
      question: "Qual e o prazo de entrega?",
      answer: "Para Portugal Continental, o prazo e de 2-5 dias uteis. Para as ilhas (Acores e Madeira), 5-7 dias uteis. Envios internacionais variam entre 7-15 dias uteis dependendo do destino.",
    },
    {
      question: "Posso devolver um produto?",
      answer: "Sim, aceitamos devolucoes ate 14 dias apos a rececao do produto, desde que esteja nas condicoes originais. Os custos de devolucao sao da responsabilidade do cliente, exceto em caso de defeito.",
    },
    {
      question: "Como funciona o sistema de leiloes?",
      answer: "Os nossos leiloes funcionam em tempo real. Registe-se, faca a sua oferta e acompanhe o leilao. O lance mais alto no final do tempo estipulado vence. Recebera notificacoes por email sobre o estado do leilao.",
    },
    {
      question: "Os cavalos a venda tem documentacao?",
      answer: "Todos os cavalos listados no Portal Lusitano possuem documentacao completa: registo na APSL (Associacao Portuguesa de Criadores do Cavalo Puro Sangue Lusitano), passaporte equino, e certificado de saude veterinario.",
    },
    {
      question: "Oferecem servico de transporte de cavalos?",
      answer: "Trabalhamos com transportadoras especializadas em transporte equino. Apos a compra, coordenamos todo o processo de transporte, incluindo documentacao e seguros necessarios.",
    },
    {
      question: "Como posso listar a minha coudelaria no portal?",
      answer: "Entre em contacto connosco atraves do email ou formulario de contacto. A nossa equipa avaliara a sua coudelaria e, se cumprir os nossos criterios de qualidade, sera adicionada ao diretorio.",
    },
    {
      question: "O conteudo do Jornal e gratuito?",
      answer: "Sim, todos os artigos do Jornal Lusitano sao de acesso gratuito. O nosso objetivo e preservar e divulgar o conhecimento sobre o Cavalo Lusitano.",
    },
  ],
  en: [
    {
      question: "What payment methods are accepted?",
      answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, bank transfer, and MB Way. All transactions are securely processed through our Shopify platform.",
    },
    {
      question: "What is the delivery time?",
      answer: "For mainland Portugal, delivery takes 2-5 business days. For the islands (Azores and Madeira), 5-7 business days. International shipping varies between 7-15 business days depending on the destination.",
    },
    {
      question: "Can I return a product?",
      answer: "Yes, we accept returns up to 14 days after receiving the product, as long as it is in original condition. Return costs are the customer's responsibility, except in case of defects.",
    },
    {
      question: "How does the auction system work?",
      answer: "Our auctions work in real-time. Register, place your bid, and follow the auction. The highest bid at the end of the stipulated time wins. You will receive email notifications about the auction status.",
    },
    {
      question: "Do the horses for sale have documentation?",
      answer: "All horses listed on Portal Lusitano have complete documentation: APSL registration (Portuguese Association of Lusitano Purebred Horse Breeders), equine passport, and veterinary health certificate.",
    },
    {
      question: "Do you offer horse transport service?",
      answer: "We work with specialized equine transport companies. After purchase, we coordinate the entire transport process, including necessary documentation and insurance.",
    },
    {
      question: "How can I list my stud farm on the portal?",
      answer: "Contact us via email or contact form. Our team will evaluate your stud farm and, if it meets our quality criteria, it will be added to the directory.",
    },
    {
      question: "Is the Journal content free?",
      answer: "Yes, all Lusitano Journal articles are free to access. Our goal is to preserve and disseminate knowledge about the Lusitano Horse.",
    },
  ],
};

function FAQAccordion({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-serif text-white group-hover:text-[#C5A059] transition-colors pr-8">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`${isOpen ? "text-[#C5A059]" : "text-zinc-500"} transition-colors`} size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-400 leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language, t } = useLanguage();
  const faqs = faqData[language];

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="text-[#C5A059]" size={32} />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
            {language === "pt" ? "Suporte" : "Support"}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            {language === "pt" ? "Perguntas Frequentes" : "Frequently Asked Questions"}
          </h1>
          <p className="text-zinc-400 font-serif italic">
            {language === "pt"
              ? "Encontre respostas as duvidas mais comuns"
              : "Find answers to the most common questions"}
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-16 text-center p-8 bg-white/[0.02] border border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-zinc-400 mb-4">
            {language === "pt"
              ? "Nao encontrou o que procurava?"
              : "Didn't find what you were looking for?"}
          </p>
          <a
            href="mailto:info@portallusitano.com"
            className="inline-block text-[#C5A059] hover:text-white transition-colors text-sm uppercase tracking-widest"
          >
            {language === "pt" ? "Contacte-nos" : "Contact us"} →
          </a>
        </motion.div>
      </div>
    </main>
  );
}
