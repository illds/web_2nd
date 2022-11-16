import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.LinkedList;

@WebServlet(name = "AreaCheckServlet", value = "/AreaCheckServlet")
public class AreaCheckServlet extends HttpServlet {
    Float x;
    Float y, r;
    long startTime;
    ServletContext servletContext;
    LinkedList<String> answer;
    int number;
    HttpServletRequest request;
    HttpServletResponse response;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.request = request;
        this.response = response;
        servletContext = request.getServletContext();
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String r = request.getParameter("r");
        if (validate(x, y, r)) {
            handleNumbers();
        } else {
            String s = "<td>Validation error</td>";
            answer.addFirst("<tr>"+ s + s + s + s + s + s +"</tr>");
            servletContext.setAttribute("answer", answer);
        }
        response.sendRedirect("index_upd.jsp");
    }

    public void handleNumbers() {
        startTime = System.nanoTime();
        String isInArea = (checkGetInto()) ? "Yes" : "No";
        float time = (float) (System.nanoTime() - startTime);
        updateNumber();
        answer = (LinkedList<String>) servletContext
                .getAttribute("answer");
        answer.addFirst("<tr><td>" + number + "</td>" +
                "<td>" + isInArea + "</td>" +
                "<td>" + r + "</td>" +
                "<td>" + x + "</td>" +
                "<td>" + y + "</td>" +
                "<td>" + time + " ns</td></tr>");
        servletContext.setAttribute("answer", answer);
    }

    public void updateNumber() {
        number = (int) servletContext
                .getAttribute("number") + 1;
        servletContext
                .setAttribute("number", number);
    }

    public boolean checkGetInto() {
        if (checkIntoTriangle() || checkIntoRectangle() || checkIntoCircle()) {
            return true;
        }
        return false;
    }

    public boolean checkIntoTriangle() {
        if ((x <= r / 2 && x >= 0) && (y >= 0 && y <= r)) {
            if (y < (r / 2 - x) * 2 ) {
                return true;
            }
        }
        return false;
    }

    public boolean checkIntoRectangle() {
        if ((x <= r / 2 && x >= 0) && (y <= 0 && y >= -r)) {
            return true;
        }
        return false;
    }

    public boolean checkIntoCircle() {
        if (((x <= 0 && x >= -r) && (y <= r && y >= 0))) {
            if (((x * x + y * y) <= r * r)) {
                return true;
            }
        }
        return false;
    }

    public boolean validate(String x, String y, String r) {
        boolean isNumbers = false;
        if (x != null && y != null && r != null) {
            if (isNumeric(x) && isNumeric(y) && isNumeric(r)) {
                this.x = Float.parseFloat(x);
                this.y = Float.parseFloat(y);
                this.r = Float.parseFloat(r);
                if (validateRange()) {
                    isNumbers = true;
                }
            }
        }
        return isNumbers;
    }

    public boolean validateRange() {
        if ((x >= -2 && x <= 2) && (y > -3.0 && y < 3.0) && (r > 1.0 && r < 4.0)) {
            return true;
        }
        return false;
    }

    public static boolean isNumeric(String str) {
        str.replaceFirst(",", ".");
        return str.matches("-?\\d+(\\.\\d+)?");
    }

}
