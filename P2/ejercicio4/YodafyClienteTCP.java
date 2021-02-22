//
// YodafyServidorIterativo
// (CC) jjramos, 2012
//
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.net.InetAddress;  
import java.net.SocketException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class YodafyClienteTCP {

	public static void main(String[] args) {
		
		byte []buferEnvio;
		byte []buferRecepcion=new byte[256];
		int bytesLeidos=0;
                
        InetAddress direccion;
        DatagramPacket paquete;
        DatagramSocket socketServicio = null;
		
		// Nombre del host donde se ejecuta el servidor:
		String host="localhost";
		// Puerto en el que espera el servidor:
		int port=8989;
		
        try {
            // Socket para la conexión UDP
            socketServicio = new DatagramSocket();
        } catch (SocketException ex) {
            Logger.getLogger(YodafyClienteTCP.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        try{
            direccion = InetAddress.getByName(host);
            
            buferEnvio="Al monte del volcán debes ir sin demora".getBytes();

            paquete = new DatagramPacket(buferEnvio,buferEnvio.length,direccion,port);
            
            System.out.print("Cliente ejecutando petición al servidor");
            
            socketServicio.send(paquete);
            
            paquete = new DatagramPacket(buferRecepcion, buferRecepcion.length);
            socketServicio.receive(paquete);

            // Lee la respuesta del servidor
            buferRecepcion = paquete.getData();
            bytesLeidos = paquete.getLength();
            
            // Mostremos la cadena de caracteres recibidos:
            System.out.println("Recibido: ");
            for(int i=0;i<bytesLeidos;i++){
                    System.out.print((char)buferRecepcion[i]);
            }
                
            socketServicio.close();
        }catch (Exception e){
            System.err.println("Error: Direccion no encontrada");
        }
		
	}
}
