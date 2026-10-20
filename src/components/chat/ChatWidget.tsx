'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PiChatCircleDots, PiPaperPlaneRight, PiX } from 'react-icons/pi';
import { useUi } from '@/store/ui';
import { useOrders, findOrder } from '@/store/orders';
import { answer, QUICK_REPLIES, type BotMessage } from '@/lib/assistant';
import { getProduct } from '@/data/products';
import { money } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Emblem } from '@/components/layout/Logo';

const GREETING: BotMessage = {
  from: 'bot',
  text: '¡Hola! Soy el asistente de Volviendo al Origen. Te ayudo con envíos, pagos, productos o el estado de tu pedido.',
};

export function ChatWidget() {
  const panel = useUi((s) => s.panel);
  const openPanel = useUi((s) => s.open);
  const close = useUi((s) => s.close);
  const open = panel === 'chat';
  const hidden = panel !== null && panel !== 'chat';
  const orders = useOrders((s) => s.orders);
  const [messages, setMessages] = useState<BotMessage[]>([GREETING]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = (raw: string) => {
    const msg = raw.trim();
    if (!msg || typing) return;
    setMessages((m) => [...m, { from: 'user', text: msg }]);
    setText('');
    setTyping(true);
    timer.current = window.setTimeout(() => {
      setMessages((m) => [...m, answer(msg, (id) => findOrder(orders, id))]);
      setTyping(false);
    }, 650);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(text);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : openPanel('chat'))}
        aria-label={open ? 'Cerrar asistente de ayuda' : 'Abrir asistente de ayuda'}
        aria-expanded={open}
        aria-controls="asistente"
        className={cn(
          'fixed right-4 bottom-[calc(1rem+var(--chat-offset,0px))] z-40 grid size-14 place-items-center rounded-2xl bg-raiz text-hueso shadow-flotante transition-[transform,opacity,bottom] duration-300 hover:bg-corteza sm:right-6 sm:bottom-6',
          hidden && 'pointer-events-none scale-90 opacity-0',
        )}
      >
        {open ? <PiX className="size-6" /> : <PiChatCircleDots className="size-7" />}
      </button>

      <section
        id="asistente"
        role="dialog"
        aria-label="Asistente de Volviendo al Origen"
        aria-modal="false"
        data-open={open}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex h-[min(82dvh,40rem)] flex-col overflow-hidden rounded-t-2xl border border-linea bg-hueso shadow-panel transition-[opacity,translate] duration-300 sm:inset-x-auto sm:right-6 sm:bottom-24 sm:h-[34rem] sm:w-[23rem] sm:rounded-2xl',
          open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-4 opacity-0',
        )}
      >
        <header className="flex items-center gap-3 bg-raiz px-4 py-3 text-hueso">
          <span className="grid size-10 place-items-center rounded-full bg-hueso/10">
            <Emblem className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Asistente Volviendo al Origen</p>
            <p className="text-xs text-hueso/75">Respuesta inmediata · Personas de 10:00 a 20:00</p>
          </div>
          <button type="button" onClick={close} aria-label="Cerrar asistente" className="grid size-10 place-items-center rounded-md hover:bg-hueso/10">
            <PiX className="size-5" />
          </button>
        </header>

        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed', m.from === 'user' ? 'rounded-br-md bg-raiz text-hueso' : 'rounded-bl-md bg-lino text-tinta')}>
                <p>{m.text}</p>
                {m.products && (
                  <ul className="mt-2 space-y-2">
                    {m.products.map((slug) => {
                      const p = getProduct(slug);
                      if (!p) return null;
                      return (
                        <li key={slug}>
                          <Link href={`/producto/${slug}`} onClick={close} className="flex items-center gap-2 rounded-lg bg-hueso p-1.5 hover:ring-1 hover:ring-arena-oscura">
                            <Image src={p.images[0]} alt="" width={44} height={44} className="size-11 rounded-md bg-lino" />
                            <span className="min-w-0 text-xs">
                              <span className="block truncate font-medium text-raiz">{p.name}</span>
                              <span className="text-humo">{money(p.price)}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {m.links && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.links.map((l) =>
                      l.external ? (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-hueso px-3 py-1.5 text-xs font-semibold text-barro ring-1 ring-arena-oscura hover:ring-barro">
                          {l.label}
                        </a>
                      ) : (
                        <Link key={l.href} href={l.href} onClick={close} className="rounded-full bg-hueso px-3 py-1.5 text-xs font-semibold text-barro ring-1 ring-arena-oscura hover:ring-barro">
                          {l.label}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-1 px-1" aria-label="El asistente está escribiendo">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 animate-pulso rounded-full bg-arena-oscura" style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-linea px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-3">
            {QUICK_REPLIES.map((q) => (
              <button key={q} type="button" onClick={() => send(q)} className="shrink-0 rounded-full border border-linea bg-white px-3 py-1.5 text-xs text-raiz hover:border-raiz">
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <label htmlFor="chat-input" className="sr-only">
              Escribe tu pregunta
            </label>
            <input ref={inputRef} id="chat-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe tu pregunta…" autoComplete="off" className="field h-11 min-h-0" />
            <button type="submit" disabled={!text.trim() || typing} aria-label="Enviar pregunta" className="grid size-11 shrink-0 place-items-center rounded-md bg-raiz text-hueso disabled:opacity-40">
              <PiPaperPlaneRight className="size-5" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
