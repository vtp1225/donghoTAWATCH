package TAWactch.example.TAWatch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TaWatchApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaWatchApplication.class, args);
	}

}
