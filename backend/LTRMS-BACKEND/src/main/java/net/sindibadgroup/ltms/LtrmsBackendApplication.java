package net.sindibadgroup.ltms;

import net.sindibadgroup.ltms.model.permission.Permission;
import net.sindibadgroup.ltms.model.role.Role;
import net.sindibadgroup.ltms.model.user.UserEntity;
import net.sindibadgroup.ltms.repository.PermissionRepository;
import net.sindibadgroup.ltms.repository.RoleRepository;
import net.sindibadgroup.ltms.repository.UserRepository;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;



import java.util.Set;

@SpringBootApplication
public class LtrmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LtrmsBackendApplication.class, args);
	}

	@Bean
	public ServletWebServerFactory servletContainer(){
		TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory(){
			protected void postProcessContext(Context context) {
				SecurityConstraint securityConstraint = new SecurityConstraint();
				securityConstraint.setUserConstraint("CONFIDENTIAL");
				SecurityCollection collection = new SecurityCollection();
				collection.addPattern("/*");
				securityConstraint.addCollection(collection);
				context.addConstraint(securityConstraint);
			}
		};


		tomcat.addAdditionalTomcatConnectors(httpToHttpsRedriectConnector());

		return tomcat ;
	}
	
	private Connector httpToHttpsRedriectConnector(){
		Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
		connector.setScheme("http");
		connector.setPort(8082);
		connector.setSecure(false);
		connector.setRedirectPort(9999);
		return connector ;

	}

}