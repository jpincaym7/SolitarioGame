import asyncio
import os
import edge_tts

VOICES_DATA = [
    # Lucina (Anime Heroine Dub in Spanish)
    {
        "filename": "lucina_step_1.mp3",
        "voice": "es-MX-DaliaNeural",
        "pitch": "+10Hz",
        "rate": "+6%",
        "text": "¡Soy Lucina de Ylisse! He venido para guiarte hacia un futuro victorioso en la mesa. Nuestro primer deber táctico es enviar las cincuenta y dos cartas a las cuatro Fundaciones superiores, ordenadas del As al Rey. ¡Asegura los Ases en cuanto queden al descubierto!"
    },
    {
        "filename": "lucina_step_2.mp3",
        "voice": "es-MX-DaliaNeural",
        "pitch": "+10Hz",
        "rate": "+6%",
        "text": "En las siete columnas del tablero forjamos nuestro avance. Las cartas se organizan en orden descendente alternando colores: rojo sobre negro y negro sobre rojo. ¡Puedes maniobrar escuadrones enteros ya alineados! Prioriza destapar cartas boca abajo para ampliar nuestras opciones."
    },
    {
        "filename": "lucina_step_3.mp3",
        "voice": "es-MX-DaliaNeural",
        "pitch": "+10Hz",
        "rate": "+6%",
        "text": "Si el frente se estanca, acude a los suministros del Mazo de Reserva superior. Cada carta extraída al descarte representa un nuevo refuerzo que puede cambiar el rumbo de la batalla. Recicla el mazo cuando lo agotes; la paciencia y el ritmo aseguran la victoria."
    },
    {
        "filename": "lucina_step_4.mp3",
        "voice": "es-MX-DaliaNeural",
        "pitch": "+10Hz",
        "rate": "+6%",
        "text": "¡Una columna despejada es una posición sagrada! Recuerda esta ley inquebrantable: únicamente un Rey, o una formación comandada por un Rey, tiene el rango de ocupar ese espacio vacío. Usa los espacios libres para maniobrar a los Reyes y liberar las columnas más bloqueadas."
    },
    {
        "filename": "lucina_step_5.mp3",
        "voice": "es-MX-DaliaNeural",
        "pitch": "+10Hz",
        "rate": "+6%",
        "text": "¡El destino de la partida está en tus manos! Haz doble clic en cualquier carta para enviarla a su fundación, presiona la tecla H para recibir una pista táctica, y Control Z para revertir cualquier error. ¡Confía en tu estrategia, desafía al destino y triunfa!"
    },

    # Ike (Heroic Anime Warrior Commander in Spanish)
    {
        "filename": "ike_step_1.mp3",
        "voice": "es-ES-AlvaroNeural",
        "pitch": "-4Hz",
        "rate": "+2%",
        "text": "¡Saludos! Soy Ike, comandante de los Mercenarios de Greil. El objetivo de la batalla es trasladar las cincuenta y dos cartas a las cuatro casillas superiores, las Fundaciones. Cada montón se forja desde el As hasta el Rey en orden ascendente y agrupando el mismo palo. ¡En cuanto veas un As libre, envíalo a su fundación de inmediato!"
    },
    {
        "filename": "ike_step_2.mp3",
        "voice": "es-ES-AlvaroNeural",
        "pitch": "-4Hz",
        "rate": "+2%",
        "text": "El campo de batalla principal son las siete columnas del tablero. Las cartas descubiertas se ordenan en escala descendente, de Rey a As, alternando estrictamente los colores: ¡Rojo sobre Negro y Negro sobre Rojo! Concéntrate en liberar y voltear las cartas ocultas en las columnas más profundas."
    },
    {
        "filename": "ike_step_3.mp3",
        "voice": "es-ES-AlvaroNeural",
        "pitch": "-4Hz",
        "rate": "+2%",
        "text": "¿Te quedaste sin jugadas directas en el tablero? Acude a los suministros en el Mazo de Reserva, arriba a la izquierda. Al hacer clic, extraerás refuerzos al descarte para incorporarlos a tus columnas o a las fundaciones. Cuando agotes el mazo, haz clic de nuevo para reciclarlo sin penalización."
    },
    {
        "filename": "ike_step_4.mp3",
        "voice": "es-ES-AlvaroNeural",
        "pitch": "-4Hz",
        "rate": "+2%",
        "text": "¡Despejar una columna completa del tablero es una posición táctica clave! Recuerda esta regla de hierro: únicamente un Rey, o una formación encabezada por un Rey, tiene el rango necesario para reclamar ese espacio vacío. Despeja columnas para transferir Reyes y destapar cartas cruciales."
    },
    {
        "filename": "ike_step_5.mp3",
        "voice": "es-ES-AlvaroNeural",
        "pitch": "-4Hz",
        "rate": "+2%",
        "text": "¡Tienes madera de estratega! Un par de maniobras rápidas: haz doble clic en cualquier carta para enviarla automáticamente a su fundación. Usa la tecla H para pedir una pista táctica, Control Z para replegar tu último movimiento, y la barra espaciadora para robar. ¡Toma tu mazo y despeja el tapete!"
    }
]

async def generate_all():
    output_dir = os.path.join("public", "sounds", "tutor")
    os.makedirs(output_dir, exist_ok=True)

    for item in VOICES_DATA:
        filepath = os.path.join(output_dir, item["filename"])
        print(f"Generating anime voice for: {item['filename']} with voice {item['voice']}...")
        communicate = edge_tts.Communicate(
            text=item["text"],
            voice=item["voice"],
            pitch=item["pitch"],
            rate=item["rate"]
        )
        await communicate.save(filepath)
        size = os.path.getsize(filepath)
        print(f"  -> Saved {item['filename']} ({size} bytes)")

    print("All anime voices generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate_all())
