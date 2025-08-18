
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

// RestController marks the class itself as a REST controller
@RestController
public class TestController {

  // GetMapping is only for a GET request
  @GetMapping("test")
  public String testController() {
    return "Test is successful!";
  };
}