package demo;

import io.karatelabs.core.MockServer;
import io.karatelabs.core.Runner;
import io.karatelabs.core.SuiteResult;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Demo-Runner fuer das Dashboard.
 *
 * Startet in @BeforeAll einen Karate-MockServer (offline, kein externes System),
 * laeuft mit outputCucumberJson(true) und erzeugt damit
 * target/karate-reports/*.json - das Eingangsformat fuer
 * scripts/karate-to-dashboard.mjs.
 */
class DemoApiTest {

    static MockServer server;

    @BeforeAll
    static void beforeAll() {
        server = MockServer
                .feature("classpath:demo/mock/ApiMock.feature")
                .port(0)                       // freier Port
                .start();
    }

    @AfterAll
    static void afterAll() {
        if (server != null) {
            server.stopAndWait();
        }
    }

    @Test
    void runDemoSuite() {
        // Dateisystem-Pfad relativ zum Modulverzeichnis (CWD beim surefire-Lauf).
        // Hinweis: Karate 2.1.4 loest "classpath:"-Praefixe bei Runner.path auf
        // Windows ueber java.io.File auf und scheitert am ':' - daher FS-Pfad.
        SuiteResult result = Runner
                .path("src/test/java/demo/api")
                // Karate 2.x: globale JS-Variable fuer die Features (systemProperty
                // wird hier nicht automatisch als JS-Global injiziert)
                .global("serverUrl", "http://localhost:" + server.getPort())
                .outputCucumberJson(true)
                .outputJsonLines(true)
                .parallel(1);
        System.out.println("[demo] Szenarien: " + result.getScenarioCount()
                + " bestanden: " + result.getScenarioPassedCount()
                + " fehlgeschlagen: " + result.getScenarioFailedCount());
        assertEquals(0, result.getScenarioFailedCount(),
                String.join("\n", result.getErrors()));
    }
}
